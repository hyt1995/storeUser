import { E12000, _createError } from '../../configs/error'
import checkPermission from '../../utils/checkPermission'
import {
    methodTypes,
    permissionTables,
} from '../../utils/checkPermission/types'
import { _genServiceResult } from '../../utils/common/result'
import { _parseSelectListParams } from '../../utils/getList'
import db from './dao'
import { IReq } from './type'

const service = async (req: IReq) => {
    const { params, payload, renewalToken } = req
    const parsedParams = _parseSelectListParams(params)

    // 어드민 권한 검사
    const table = permissionTables.favorites
    const method = methodTypes.read
    const adminIdx = payload.userIdx
    if (
        !payload.isAdmin ||
        !(await checkPermission({ adminIdx, table, method }))
    ) {
        throw _createError(E12000)
    }

    const { count, items } = await db.getList(table, parsedParams)

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
