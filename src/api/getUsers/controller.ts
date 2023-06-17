import type { APIGatewayEvent } from 'aws-lambda'
import { E00000, E12000, _createError } from '../../configs/error'
import { IResult } from '../../types'
import { _authProcess } from '../../utils/auth'
import checkPermission from '../../utils/checkPermission'
import mysql from '../../utils/common/mysql'
import { _extractParams } from '../../utils/common/request'
import { _genErrorResult, _genResponse } from '../../utils/common/result'
import getList from '../../utils/dao/getList'
import { IGetListParams } from '../../utils/dao/getList/types'
import { methodTypes, permissionTables } from '../../utils/dao/types'

export const handler = async (event: APIGatewayEvent) => {
    let result: IResult | undefined
    console.info('🚀 ~ event', event)
    try {
        await mysql.beginTransaction()

        const authOption = await _authProcess(event)
        const req = _extractParams<IGetListParams>(event, authOption)

        const table = permissionTables.users
        const method = methodTypes.read
        const adminIdx = req.payload.userIdx
        if (
            !req.payload.isAdmin ||
            !(await checkPermission({ adminIdx, table, method }))
        ) {
            throw _createError(E12000)
        }
        const tableConfig = [
            { name: table, alias: 'u', key: 'idx' },
            { name: 'profile', alias: 'p', key: 'user_idx' },
            { name: 'balances', alias: 'b', key: 'user_idx' },
        ]
        result = await getList(req, tableConfig, false)

        await mysql.commit()
    } catch (e: any) {
        console.info(e)
        await mysql.rollback()
        result = _genErrorResult(e.toString())
    } finally {
        if (result === undefined) {
            console.error('API 정상 작동 불가')
            throw _createError(E00000)
        }

        return _genResponse(result, event)
    }
}
