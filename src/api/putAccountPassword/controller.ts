import type { APIGatewayEvent } from 'aws-lambda'
import { E00000, _createError } from '../../configs/error'
import { ICertificateTokenPayload, IResult } from '../../types'
import { _verifyToken } from '../../utils/common/jwt'
import mysql from '../../utils/common/mysql'
import { _extractParams, _parseCookie } from '../../utils/common/request'
import { _genErrorResult, _genResponse } from '../../utils/common/result'
import service from './service'
import { IParams, IReq } from './types'

const controller = async (req: IReq): Promise<IResult> => {
    try {
        const { headers } = req
        const { certificateToken } = _parseCookie(
            headers.Cookie ?? headers.cookie,
        )
        const { email, authMethod } =
            _verifyToken<ICertificateTokenPayload>(certificateToken)
        req.payload = {
            email,
            authMethod,
        }

        const result = await service(req)

        return result
    } catch (error) {
        throw error
    }
}

export const handler = async (event: APIGatewayEvent) => {
    let result: IResult | undefined
    console.info('🚀 ~ event', event)

    try {
        await mysql.beginTransaction()
        const req = _extractParams<IParams>(event) as unknown as IReq
        result = await controller(req)
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
