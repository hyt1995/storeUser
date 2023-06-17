import { E10003, _createError } from '../../../configs/error'
import { AuthMethodType } from '../../../constants/enums'
import { _setCookies } from '../../../utils/common/cookie'
import { _setCertificateToken } from '../../../utils/common/jwt'
import { __genServiceResult_old } from '../../../utils/common/result'
import db from '../dao'
import { _requestNaverAccountInfo } from '../modules/naverAccount'

/** 회원가입 인자 타입 */
interface IPostUserEventBody {
    [key: string]: any
}

// sns 이메일 검증
const verifyNaver = async (body: IPostUserEventBody) => {
    const { tokenId, state } = body
    // 토큰 state 이 있는지 확인
    if (tokenId === undefined || state === undefined) {
        throw _createError(E10003)
    }

    // 네이버에게 계정 정보를 요청합니다.
    let email
    try {
        const accountInfo = await _requestNaverAccountInfo(tokenId, state)
        email = accountInfo.email
    } catch (e) {
        throw e
    }

    // 기존에 저장되어있는 이메일이 존재하는지 확인합니다.
    const isRegistered = await db.checkEmailExistence(email)

    // 인증 토큰을 생성합니다.
    const certificateToken = await _setCertificateToken(
        email,
        AuthMethodType.NAVER,
    )

    // 토큰을 쿠키로 보내주고 성공메세지 반환
    const cookies = _setCookies([
        {
            name: 'certificateToken',
            value: certificateToken,
            options: {
                httpOnly: true,
                secure: true,
            },
        },
    ])

    return __genServiceResult_old(
        200,
        { status: 'success', isRegistered },
        { ...(process.env.APP_ENV === 'local' ? cookies : {}) },
        { ...(process.env.APP_ENV !== 'local' ? cookies : {}) },
    )
}

export default verifyNaver
