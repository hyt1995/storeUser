import { E10003, _createError } from '../../../configs/error'
import { AuthMethodType } from '../../../constants/enums'
import { _setCookies } from '../../../utils/common/cookie'
import { _setCertificateToken } from '../../../utils/common/jwt'
import { __genServiceResult_old } from '../../../utils/common/result'
import db from '../dao'
import { _requestKakaoAccountInfo } from '../modules/kakaoAccount'

/** 회원가입 인자 타입 */
interface IPostUserEventBody {
    [key: string]: any
}

// sns 이메일 검증
const verifyKakao = async (body: IPostUserEventBody) => {
    const { tokenId } = body
    // 토큰 state 이 있는지 확인
    if (tokenId === undefined) {
        throw _createError(E10003)
    }

    // 카카오에게 계정 정보를 요청합니다.
    let email
    try {
        const accountInfo = await _requestKakaoAccountInfo(tokenId)
        email = accountInfo.email
    } catch (e) {
        throw e
    }

    // 기존에 저장된 이메일이 있는지 확인
    const isRegistered = await db.checkEmailExistence(email)

    // 인증 토큰 생성
    const certificateToken = await _setCertificateToken(
        email,
        AuthMethodType.KAKAO,
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

    // 응답
    return __genServiceResult_old(
        200,
        { status: 'success', isRegistered },
        { ...(process.env.APP_ENV === 'local' ? cookies : {}) },
        { ...(process.env.APP_ENV !== 'local' ? cookies : {}) },
    )
}

export default verifyKakao
