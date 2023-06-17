import type { APIGatewayEvent } from 'aws-lambda'
import {
    E00000,
    E10001,
    E10002,
    E10003,
    E12001,
    _createError,
} from '../../configs/error'
import { AuthMethodType } from '../../constants/enums'
import { IResult, ServiceFunctionType } from '../../types'
import mysql from '../../utils/common/mysql'
import { _extractParams, _parseCookie } from '../../utils/common/request'
import { _genErrorResult, _genResponse } from '../../utils/common/result'
import { _validateEnumType } from '../../utils/common/validate'
import serviceEmail from './services/email'
import serviceSns from './services/sns'
import { IParams, IReq } from './types'

const services: {
    [key in AuthMethodType]: ServiceFunctionType<IReq>
} = {
    email: serviceEmail,
    kakao: serviceSns,
    naver: serviceSns,
    google: serviceSns,
}

const controller = async (req: IReq): Promise<IResult> => {
    try {
        const {
            params: { email, password, authMethod, isAutoLogin },
            headers,
        } = req

        if (!_validateEnumType(authMethod, AuthMethodType)) {
            console.info('정해진 enum 타입이 아닙니다.')
            throw _createError(E10002)
        }

        if (typeof isAutoLogin !== 'boolean') {
            throw _createError(E10001)
        }

        if (authMethod === 'email') {
            if (email === undefined || password === undefined) {
                throw _createError(E10003)
            }
        } else {
            const { certificateToken } = _parseCookie(
                headers.Cookie ?? headers.cookie,
            )

            if (certificateToken === undefined) {
                throw _createError(E12001)
            }
        }

        const service = services[authMethod]
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
        const req = _extractParams<IParams>(event)
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
