import { E10002, E21003, E22000, _createError } from '../../../configs/error'
import { _genServiceResult } from '../../../utils/common/result'
import { _validatePassword } from '../../../utils/common/validate'
import db from '../dao'
import { _hash } from '../modules'
import { IReq } from '../types'
import loginSetCookies from './loginSetCookies'

/** 이메일 회원가입 */
const serviceEmail = async (req: IReq) => {
    const {
        params: { password, serviceTerm, privateTerm, marketingTerm },
        payload: { email },
    } = req
    if (typeof password !== 'string') {
        throw _createError(E10002)
    }

    // 해당 이메일이 가입된 이메일인지를 확인한다.
    const isExistEmail = await db.checkExistEmail(email)
    if (isExistEmail) {
        throw _createError(E21003)
    }

    // 입력받은 비밀번호에 대한 유효성을 검사합니다.
    if (!_validatePassword(password)) {
        throw _createError(E22000)
    }

    // 비밀번호를 암호화합니다.
    const hashedPassword = await _hash(password)

    // email 기반 가입의 신규 사용자를 생성합니다.
    const userIdx = await db.addNewEmailUser(email, hashedPassword)
    await db.createBalance(userIdx)
    await db.createTerms({ userIdx, serviceTerm, privateTerm, marketingTerm })
    await db.createProfile({ userIdx })
    await db.createAuthStates({ userIdx })

    const cookies = await loginSetCookies(userIdx, email)

    return _genServiceResult({
        statusCode: 200,
        data: {
            userIdx,
            email,
        },
        cookies,
    })
}

export default serviceEmail
