import bcrypt from 'bcryptjs'
import { E10001, E21000, _createError } from '../../../configs/error'
import { UserStateType } from '../../../constants/enums'
import { ICookie } from '../../../types'
import { _genAccessToken, _genRefreshToken } from '../../../utils/common/jwt'
import { _genServiceResult } from '../../../utils/common/result'
import db from '../dao'
import { IReq } from '../types'

/** 서비스 - 로그인 */
const service = async (req: IReq) => {
    const {
        params: { email, password, isAutoLogin },
    } = req

    if (typeof email !== 'string' || typeof password !== 'string') {
        throw _createError(E10001)
    }

    // 이메일로 정보를 가져온다.
    const userInfo = await db.selectUserInfo(email)
    // 이메일이 존재하지 않을 경우 로그인 실패
    if (userInfo === null) {
        console.info('해당 이메일로 가입된 이력이 존재하지 않습니다.')
        throw _createError(E21000)
    }
    const { password: encryptedPassword, idx: userIdx, user_state } = userInfo

    if (
        [
            UserStateType.DEACTIVATED,
            UserStateType.DORMANCY,
            UserStateType.TRANSACTION,
            UserStateType.ACCESS,
        ].includes(user_state)
    ) {
        console.info('탈퇴, 휴면, 정지된 계정입니다.')
        throw _createError(E21000)
    }

    // 비밀번호를 비교 후에 오류 반환
    const isPasswordEqual = await bcrypt.compare(password, encryptedPassword)
    if (!isPasswordEqual) {
        console.info('비밀번호가 일치하지 않습니다.')
        throw _createError(E21000)
    }

    // 이중화 토큰 생성
    const accessToken = _genAccessToken(userIdx, email)
    const refreshToken = _genRefreshToken(userIdx, email, isAutoLogin)

    // auth_tokens에 토큰 저장
    await db.saveAuthToken(accessToken, refreshToken)

    // 토큰을 쿠키로 보내주고 성공메세지 반환
    const cookies: ICookie[] = [
        {
            name: 'accessToken',
            value: accessToken,
            options: {
                httpOnly: true,
                secure: true,
                maxAge: isAutoLogin ? 60 * 60 * 24 * 28 : undefined,
            },
        },
        {
            name: 'refreshToken',
            value: refreshToken,
            options: {
                httpOnly: true,
                secure: true,
                maxAge: isAutoLogin ? 60 * 60 * 24 * 28 : undefined,
            },
        },
    ]

    return _genServiceResult({
        statusCode: 200,
        data: {
            userIdx,
            email,
        },
        cookies,
    })
}

export default service
