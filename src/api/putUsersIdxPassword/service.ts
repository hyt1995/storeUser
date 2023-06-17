import bcrypt from 'bcryptjs'
import { E12000, E21005, E22000, _createError } from '../../configs/error'
import { _genServiceResult } from '../../utils/common/result'
import { _validatePassword } from '../../utils/common/validate'
import db from './dao'
import type { IReq } from './types'

const service = async (req: IReq) => {
    const {
        params: { idx, password },
        payload: { userIdx, isAdmin },
        renewalToken,
    } = req

    if (isAdmin === false && userIdx !== idx) {
        throw _createError(E12000)
    }

    // 비밀번호 유효성 검사
    if (!_validatePassword(password)) {
        throw _createError(E22000)
    }
    const prevPassword = await db.selectPassword(idx)
    if (await bcrypt.compare(password, prevPassword)) {
        throw _createError(E21005)
    }

    // 비밀번호 변경
    // 비밀번호 암호화
    const salt = await bcrypt.genSalt(10)
    const hashedPassword: string = await bcrypt.hash(password as string, salt)

    await db.updatePassword(idx, hashedPassword)

    return _genServiceResult({
        statusCode: 200,
        data: {
            status: 'success',
        },
        renewalToken,
    })
}

export default service
