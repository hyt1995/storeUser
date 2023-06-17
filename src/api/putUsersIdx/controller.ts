import type { APIGatewayEvent } from 'aws-lambda'
import { E00000, E12000, _createError } from '../../configs/error'
import { IResult } from '../../types'
import { _authProcess } from '../../utils/auth'
import mysql from '../../utils/common/mysql'
import { _extractParams } from '../../utils/common/request'
import { _genErrorResult, _genResponse } from '../../utils/common/result'
import checkPermission from '../../utils/dao/checkPermission'
import { methodTypes, permissionTables } from '../../utils/dao/types'
import service from './service'
import { IParams } from './types'

export const handler = async (event: APIGatewayEvent) => {
    let result: IResult | undefined
    console.info('🚀 ~ event', event)
    try {
        await mysql.beginTransaction()
        const authOption = await _authProcess(event)
        const req = _extractParams<IParams>(event, authOption)

        const table = permissionTables.users
        const method = methodTypes.write
        const adminIdx = req.payload.userIdx
        if (
            !req.payload.isAdmin ||
            !(await checkPermission({ adminIdx, table, method }))
        ) {
            throw _createError(E12000)
        }

        result = await service(table, req)

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
