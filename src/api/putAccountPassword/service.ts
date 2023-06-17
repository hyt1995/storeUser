import bcrypt from 'bcryptjs'
import { E22000, _createError } from '../../configs/error'
import { _genServiceResult } from '../../utils/common/result'
import { _validatePassword } from '../../utils/common/validate'
import db from './dao'
import { IReq } from './types'

const service = async (req: IReq) => {
    const {
        payload: { email },
        params: { password },
        renewalToken,
    } = req

    // 비밀번호 유효성 검사
    if (!_validatePassword(password)) {
        throw _createError(E22000)
    }

    // 비밀번호 암호화
    const salt = await bcrypt.genSalt(10)
    const hashedPassword: string = await bcrypt.hash(password as string, salt)

    // 해당 email에 등록되어있는 비밀번호를 변경한다.
    await db.updatePassword(email, hashedPassword)

    return _genServiceResult({
        statusCode: 200,
        data: {
            status: 'success',
        },
        renewalToken,
    })
}

export default service
