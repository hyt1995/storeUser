import { E20002, _createError } from '../../configs/error'
import { _genServiceResult } from '../../utils/common/result'
import db from './dao'
import { IReq } from './type'

const service = async (req: IReq) => {
    const { params, payload, renewalToken } = req
    const { isFavorite } = params

    // 리소스 소유자 검사
    if (payload.userIdx !== parseInt(params.idx, 10)) {
        throw _createError(E20002)
    }

    const updateParams = {
        user_idx: payload.userIdx,
        product_idx: params.product_idx,
    }
    // 좋아요 추가/삭제
    if (isFavorite) {
        await db.insertFavorite(updateParams)
    } else {
        await db.deleteFavorite(updateParams)
    }

    return _genServiceResult({
        statusCode: 200,
        data: {},
        renewalToken,
    })
}

export default service
