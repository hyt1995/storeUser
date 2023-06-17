import type { APIGatewayEvent } from 'aws-lambda'
import { E00000, _createError } from '../../configs/error'
import { IResult } from '../../types'
import mysql from '../../utils/common/mysql'
import { __extractParams_old } from '../../utils/common/request'
import { _genErrorResult, _genResponse } from '../../utils/common/result'
import service from './service'

export const handler = async (event: APIGatewayEvent) => {
    let result: IResult | undefined
    console.info('🚀 ~ event', event)
    try {
        await mysql.beginTransaction()

        const params = __extractParams_old<{ [key: string]: any }>(event)
        result = await service(params)

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
