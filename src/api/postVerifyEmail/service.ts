import { E11001, E11002, _createError } from '../../configs/error'
import { AuthMethodType } from '../../constants/enums'
import { ICookie } from '../../types'
import { _genCertificateToken } from '../../utils/common/jwt'
import { _genServiceResult } from '../../utils/common/result'
import db from './dao'
import { IReq } from './types'

const service = async (req: IReq) => {
    const {
        params: { email, code },
    } = req

    // 해당 email를 가진 내용이 있는지 검사 (code 반환)
    // 없다면 해당 email로 온 요청이 존재하지 않습니다.
    const emailAuthCode = await db.getEmailAuthCode(email)
    if (emailAuthCode === undefined) {
        throw _createError(E11001)
    }

    // code 비교
    if (emailAuthCode !== code) {
        throw _createError(E11002)
    }

    // 해당 email 검증 요청을 인증됨으로 변환
    await db.updateAuthorizedEmailAuth(email)

    // email을 담은 3분짜리 토큰 반환
    const certificateToken = _genCertificateToken(email, AuthMethodType.EMAIL)
    const cookies: ICookie[] = [
        {
            name: 'certificateToken',
            value: certificateToken,
            options: {
                httpOnly: true,
                secure: true,
            },
        },
    ]

    return _genServiceResult({
        statusCode: 200,
        data: {
            status: 'success',
        },
        cookies,
    })
}

export default service
