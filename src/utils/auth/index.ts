import { APIGatewayEvent } from 'aws-lambda'
import jwt from 'jsonwebtoken'
import {
    E12000,
    E12001,
    E20015,
    E22002,
    _createError,
} from '../../configs/error'
import { ITokenPayload } from '../../types'
import { _decodeToken, _genAccessToken, _verifyToken } from '../common/jwt'
import mysql from '../common/mysql'
import { _parseCookie } from '../common/request'
import db from './dao'

enum TokenStateType {
    VALID = 'VALID',
    EXPIRED = 'EXPIRED',
    INVALID = 'INVALID',
}

const verify = (token: string | undefined) => {
    let tokenState = TokenStateType.VALID
    try {
        if (typeof token !== 'string') {
            console.info(`토큰이 유효하지 않습니다.`)
            tokenState = TokenStateType.INVALID
        } else {
            _verifyToken(token)
        }
    } catch (e: any) {
        if (typeof e !== 'object') {
            console.warn('에러가 object가 아님', e)
            throw _createError(E22002)
        } else if (typeof e.name !== 'string') {
            console.warn('에러가 string이 아님', e)
            throw _createError(E22002)
        }

        const jwtError = e as jwt.JsonWebTokenError
        if (jwtError.name === 'TokenExpiredError') {
            tokenState = TokenStateType.EXPIRED
        } else if (jwtError.name === 'JsonWebTokenError') {
            tokenState = TokenStateType.INVALID
        } else {
            console.warn(e)
            tokenState = TokenStateType.INVALID
        }
    }
    return tokenState
}

// auth_tokens에서 토큰을 가져오는 DAO
const selectAccessToken = async (refreshToken: string) => {
    const sql = `SELECT access_token as accessToken FROM auth_tokens WHERE refresh_token = ?;`
    const value = [refreshToken]
    const selectAuthTokenRes = await mysql.read(sql, value)
    if (selectAuthTokenRes.length !== 1) {
        console.info(
            `토큰을 찾지 못하였습니다. 찾은 값: ${selectAuthTokenRes.length}`,
        )
        return undefined
    }

    const accessToken = selectAuthTokenRes[0].accessToken as string
    return accessToken
}

// 새로 발급한 access토큰 DB에 업데이트 하기
const _updateAccessToken = async (
    accessToken: string,
    refreshToken: string,
) => {
    const sql = `UPDATE auth_tokens SET access_token = ? WHERE refresh_token = ?;`
    const value = [accessToken, refreshToken]
    const selectAuthTokenRes = await mysql.write(sql, value)
    return selectAuthTokenRes
}

/**
 * @deprecated _verifyAuth와 _authProcess 함수로 대체
 * @param cookie
 * @returns
 */
export const _verifyUserAuth = async (cookie = '') => {
    if (typeof cookie !== 'string' || cookie === '') {
        throw _createError(E12001)
    }
    // 쿠키에 저장된 토큰을 객체 형식으로 저장시켜준다.
    const cookieObj = _parseCookie(cookie)

    // 접근 토큰과 재발급 토큰을 추출한다.
    const { accessToken, refreshToken } = cookieObj
    if (!(Boolean(accessToken) || Boolean(refreshToken))) {
        console.info('E12000: 토큰이 존재하지 않습니다.')
        throw _createError(E12000)
    }

    // Payload를 가져온다.
    const payload = _verifyToken<ITokenPayload>(refreshToken)

    // Refresh Token을 기준으로 Access 토큰을 불러온다.
    const storedAccessToken = await selectAccessToken(refreshToken)

    // DB토큰 하고 cookie토큰이 두개 다 일치할 경우
    if (storedAccessToken !== accessToken) {
        console.info('E12000: 저장되어 있는 토큰과 값이 다릅니다.')
        throw _createError(E12000)
    }

    try {
        _verifyToken(accessToken)
        return { payload }
    } catch {
        // access토큰이 기간 만료일 경우 유저 정보와 새로운 access토큰을 발급해준다.
        const renewalToken = _genAccessToken(payload.userIdx, payload.email)

        // 새로 발급한 access 토큰 DB에 저장해주기
        await _updateAccessToken(renewalToken, refreshToken)

        return {
            renewalToken,
            payload,
        }
    }
}

export enum VerifyType {
    VALID = 'VALID',
    NEED_DELETE = 'NEED_DELETE',
    NEED_RENEWAL = 'NEED_RENEWAL',
    NEED_RE_SIGNIN = 'NEED_RE_SIGNIN',
}

export const _verifyAuth = async ({
    accessToken,
    refreshToken,
}: {
    accessToken?: string
    refreshToken?: string
}) => {
    if (accessToken === undefined || refreshToken === undefined) {
        return VerifyType.NEED_RE_SIGNIN
    }

    // accessToken 검증
    const accessTokenState = verify(accessToken)

    if (accessTokenState === TokenStateType.VALID) {
        // 1번 케이스: 성공
        return VerifyType.VALID
    }

    console.info('accessTokenState: ', accessTokenState)
    // refreshToken 검증
    const refreshTokenState = verify(refreshToken)
    console.info('refreshTokenState: ', refreshTokenState)
    if (refreshTokenState === TokenStateType.INVALID) {
        // 6번 케이스 포함 (refreshToken이 유효하지 않은 경우)
        console.info('refreshToken이 유효하지 않습니다.')
        return VerifyType.NEED_RE_SIGNIN
    }

    if (refreshTokenState === TokenStateType.EXPIRED) {
        // 5번 케이스 포함 (refreshToken이 만료된 경우)
        console.info('refreshToken이 만료되었습니다.')
        return VerifyType.NEED_DELETE
    }

    // refreshToken을 비교하여 DB에 저장된 AccessToken 조회
    const storedAccessToken = await db.getStoredAccessToken(refreshToken)
    if (storedAccessToken === undefined) {
        // 미지정 케이스 (refreshToken이 일치하지 않은 경우)
        console.info('storedAccessToken이 없습니다.')
        return VerifyType.NEED_RE_SIGNIN
    }

    // refreshToken이 유효하고 db에 저장된 값과 일치하는 경우
    if (accessTokenState === TokenStateType.EXPIRED) {
        // 2, 3, 4번 케이스
        if (storedAccessToken === accessToken) {
            // 2번 케이스
            return VerifyType.NEED_RENEWAL
        }

        const { iat } = jwt.decode(storedAccessToken, {
            json: true,
        }) as jwt.JwtPayload
        if (typeof iat !== 'number') {
            console.info(`토큰 iat 유효하지 않습니다.`)
            return VerifyType.NEED_RE_SIGNIN
        }

        const now = Math.floor(Date.now() / 1000)
        if (now - iat <= 10) {
            // 3번 케이스

            console.info(`토큰 iat 10초 이내가 아닙니다.`)
            return VerifyType.NEED_RENEWAL
        }
        // 4번 케이스
        console.info(`accessTokenState EXPIRED 모든 조건문 통과.`)
        return VerifyType.NEED_DELETE
    }
    // Access Token이 유효하지 않은 경우
    // 7번 케이스
    console.info(`모든 조건문 통과.`)
    return VerifyType.NEED_DELETE
}

export const _decodeAuth = (accessToken: string) => {
    return _decodeToken<ITokenPayload>(accessToken)
}

export const _deleteAuth = async (refreshToken: string) => {
    // mysql db에서 refreshToken을 기준으로 accessToken을 삭제한다.
    await db.deleteStoredTokens(refreshToken)
}

export const _refreshAuth = async (refreshToken: string) => {
    const payload = _decodeToken<ITokenPayload>(refreshToken)
    const renewalToken = _genAccessToken(
        payload.userIdx,
        payload.email,
        payload.isAdmin,
    )

    // 새로 발급한 access 토큰 DB에 저장해주기
    await db.refreshAccessToken(renewalToken, refreshToken)

    return {
        renewalToken,
    }
}

export const _authProcess = async (event: APIGatewayEvent) => {
    const cookieObj = _parseCookie(
        event.headers?.Cookie ?? event.headers?.cookie,
    )
    const { accessToken, refreshToken } = cookieObj
    const verifyState = await _verifyAuth(cookieObj)
    if (verifyState === VerifyType.NEED_DELETE) {
        await _deleteAuth(refreshToken)
        throw _createError(E20015)
    } else if (verifyState === VerifyType.NEED_RE_SIGNIN) {
        throw _createError(E20015)
    }

    const authResult: { payload: ITokenPayload; renewalToken?: string } = {
        payload: _decodeAuth(accessToken),
    }
    if (verifyState === VerifyType.NEED_RENEWAL) {
        const { renewalToken } = await _refreshAuth(refreshToken)
        authResult.renewalToken = renewalToken
    }

    return authResult
}
