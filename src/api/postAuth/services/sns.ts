import { E10002, E20001, E21000, _createError } from '../../../configs/error'
import { ICookie } from '../../../types'
import {
    ICertificateTokenPayload,
    _genAccessToken,
    _genRefreshToken,
    _verifyToken,
} from '../../../utils/common/jwt'
import { _parseCookie } from '../../../utils/common/request'
import { _genServiceResult } from '../../../utils/common/result'
import db from '../dao'
import { IReq } from '../types'

/** 서비스 - 로그인 */
const service = async (req: IReq) => {
    const {
        params: { authMethod, isAutoLogin },
        headers,
    } = req
    const { certificateToken } = _parseCookie(headers.Cookie ?? headers.cookie)

    // 인증 토큰 해석
    // 인증 토큰과 입력 authMethod 일치 여부 확인
    const { email, authMethod: authMethodByToken } =
        _verifyToken<ICertificateTokenPayload>(certificateToken)
    if (authMethodByToken !== authMethod) {
        console.info('E10002: 인증 토큰과 입력 authMethod가 일치하지 않습니다.')
        throw _createError(E10002)
    }

    // db authMethod와 일치 여부 확인
    const userInfo = await db.selectUserInfo(email)
    if (userInfo === null) {
        console.info('E21000: 해당 계정은 존재하지 않습니다.')
        throw _createError(E21000)
    }
    const {
        authMethod: authMethodByDatabase,
        idx: userIdx,
        user_state,
    } = userInfo

    if (
        [
            'dormancy',
            'sanction_abnormal_transaction',
            'sanction_abnormal_access',
        ].includes(user_state)
    ) {
        console.info('E20001: 휴면, 정지된 계정입니다.')
        throw _createError(E20001)
    }

    if (authMethodByDatabase !== authMethod) {
        console.info('E21000: db authMethod와 일치하지 않습니다.')
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
            },
        },
        {
            name: 'refreshToken',
            value: refreshToken,
            options: {
                httpOnly: true,
                secure: true,
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
