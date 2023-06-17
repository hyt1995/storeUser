import bcrypt from 'bcryptjs'
import { E00000, E21001, E21004, _createError } from '../../configs/error'
import { AuthMethodType } from '../../constants/enums'
import { _genServiceResult } from '../../utils/common/result'
import db from './dao'
import type { IReq } from './types'

const service = async (req: IReq) => {
    const {
        payload: { email },
        params: { password },
        renewalToken,
    } = req

    // 이메일로 정보를 가져온다.
    const userInfo = await db.selectUserInfo(email)
    if (userInfo === undefined) {
        console.error('00000: 로직이 잘못되었습니다.')
        throw _createError(E00000)
    }

    const { authMethod, password: encryptedPassword } = userInfo
    if (authMethod !== AuthMethodType.EMAIL) {
        throw _createError(E21001)
    }

    // 비밀번호를 비교 후에 오류 반환
    const isPasswordEqual = await bcrypt.compare(password, encryptedPassword)
    if (!isPasswordEqual) {
        console.info('21004: 비밀번호 오류')
        throw _createError(E21004)
    }

    return _genServiceResult({
        statusCode: 200,
        data: {
            status: 'success',
        },
        renewalToken,
    })
}

export default service
