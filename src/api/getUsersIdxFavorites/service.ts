import { E20002, _createError } from '../../configs/error'
import { _genServiceResult } from '../../utils/common/result'
import { _parseSelectListParams } from '../../utils/getList'
import db from './dao'
import { IReq } from './type'

const service = async (req: IReq) => {
    const { params, payload, renewalToken } = req
    const parsedParams = _parseSelectListParams(params)

    // 리소스 소유자 검사
    if (payload.userIdx !== parseInt(params.idx, 10)) {
        throw _createError(E20002)
    }

    // 소유자 목록으로 필터링 파라미터 추가
    parsedParams.filterFields.push('user_idx')
    parsedParams.filterValues.push(`${payload.userIdx}`)

    const { count, items } = await db.getList('favorites', parsedParams)

    return _genServiceResult({
        statusCode: 200,
        data: {
            count,
            items,
        },
        renewalToken,
    })
}

export default service
