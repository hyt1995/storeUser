import { E21003, _createError } from '../../../configs/error'
import { AuthMethodType, UserStateType } from '../../../constants/enums'
import { _genServiceResult } from '../../../utils/common/result'
import db from '../dao'
import { IReq } from '../types'
import loginSetCookies from './loginSetCookies'

const service = async (req: IReq) => {
    const {
        params: { serviceTerm, privateTerm, marketingTerm },
        payload: { email },
    } = req

    // 해당 이메일이 가입된 이메일인지를 확인한다.
    const isExistEmail = await db.checkExistEmail(email)
    if (isExistEmail) {
        throw _createError(E21003)
    }

    // 대기 상태의 신규회원 추가
    const userIdx = await db.addNewSnsUser(
        email,
        UserStateType.WAITING,
        AuthMethodType.GOOGLE,
    )
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

export default service
