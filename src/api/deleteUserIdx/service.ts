import { E10001, E20021, _createError } from '../../configs/error'
import { UserStateType } from '../../constants/enums'
import { ICookie } from '../../types'
import { _genServiceResult } from '../../utils/common/result'
import db from './dao'
import { IReq } from './types'

const service = async (req: IReq) => {
    const {
        params: { assetAbandonTerm, idx },
        payload: { userIdx },
    } = req
    if (userIdx !== parseInt(idx, 10)) {
        throw _createError(E10001)
    }

    if (assetAbandonTerm !== true) {
        throw _createError(E20021)
    }

    // User.users 테이블 내 유저 상태를 변경
    await db.updateUserState(UserStateType.DEACTIVATED, userIdx)

    // User.terms 테이블 자진삭감 동의 저장
    await db.updateAssetAbandonTerm(Boolean(assetAbandonTerm), userIdx)

    // User.balances 테이블 내 자산을 0으로 변경
    await db.updateBalanceToZero(userIdx)

    const cookies: ICookie[] = [
        {
            name: 'accessToken',
            value: '',
            options: {
                httpOnly: true,
                secure: true,
                maxAge: 0,
            },
        },
        {
            name: 'refreshToken',
            value: '',
            options: {
                httpOnly: true,
                secure: true,
                maxAge: 0,
            },
        },
    ]

    return _genServiceResult({
        statusCode: 200,
        data: {
            result: 'success',
        },
        cookies,
    })
}

export default service
