import { _genServiceResult } from '../../utils/common/result'
import db from './dao'
import { E12000, E20024, _createError } from '../../configs/error'
import { IReq } from './types'

const service = async (req: IReq) => {
    const {
        params: { idx },
        payload: { userIdx, isAdmin },
        renewalToken,
    } = req

    // 타 유저의 정보를 조회할 경우 에러를 반환합니다.
    if (isAdmin === false && userIdx !== Number(idx)) {
        throw _createError(E12000)
    }

    // 유저 잔액 조회
    const balanceRow = await db.getBalanceDeo(userIdx)
    if (!Boolean(balanceRow)) {
        throw _createError(E20024)
    }

    return _genServiceResult({
        statusCode: 200,
        data: {
            balance: balanceRow.balance,
            reward: balanceRow.reward,
            event: balanceRow.event,
        },
        renewalToken,
    })
}

export default service
