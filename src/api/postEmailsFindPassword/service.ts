import { E11000, E21003, _createError } from '../../configs/error'
import { _getSetTemplate, _sendFormatEmail } from '../../utils/common/email'
import { _genServiceResult } from '../../utils/common/result'
import db from './dao'
import { genCode } from './modules'
import { IReq } from './types'

const service = async (req: IReq) => {
    const {
        params: { email },
        renewalToken,
    } = req

    // 해당 이메일이 가입된 이메일인지를 확인한다.
    const isExistEmail = await db.checkExistEmail(email)
    if (!isExistEmail) {
        throw _createError(E21003)
    }

    // 해당 이메일로 요청온 내역을 확인한다.
    const count = await db.countEmailAuthRequest(email)
    if (count >= 5) {
        console.info('11000: 이메일 요청이 잦았습니다.')
        throw _createError(E11000)
    }

    // 이전의 인증 확인이 되지않은 인증 코드들은 취소 상태로 전환한다.
    await db.setCancelLegacyEmailAuth(email)

    // 인증 코드를 생성한다.
    const authCode = genCode()
    await db.createNewEmailAuth(email, authCode)

    // 인증 코드를 이메일로 발송한다.
    const { subject, html } = _getSetTemplate('default', [authCode])
    await _sendFormatEmail(email, { subject, html })

    return _genServiceResult({
        statusCode: 200,
        data: {
            status: 'success',
        },
        renewalToken,
    })
}

export default service
