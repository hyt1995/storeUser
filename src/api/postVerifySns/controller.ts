import type { APIGatewayEvent } from 'aws-lambda'
import { E00000, E10000, E10002, _createError } from '../../configs/error'
import { AuthMethodType } from '../../constants/enums'
import { IResult } from '../../types'
import mysql from '../../utils/common/mysql'
import { __extractParams_old } from '../../utils/common/request'
import { _genErrorResult, _genResponse } from '../../utils/common/result'
import { _validateEnumType } from '../../utils/common/validate'
import serviceKakao from './services/kakao'
import serviceNaver from './services/naver'
import { IPostVerifySnsParams } from './types'

const services: { [key in AuthMethodType]: any } = {
    kakao: serviceKakao,
    naver: serviceNaver,
    google: null,
    email: null,
}

export const handler = async (event: APIGatewayEvent) => {
    let result: IResult | undefined
    console.info('🚀 ~ event', event)
    try {
        await mysql.beginTransaction()

        const params = __extractParams_old<IPostVerifySnsParams>(event)
        const { platform } = params
        if (typeof platform !== 'string') {
            throw _createError(E10000)
        }

        if (!_validateEnumType(platform, AuthMethodType)) {
            console.info('정해진 enum 타입이 아닙니다.')
            throw _createError(E10002)
        }

        result = await services[platform](params, event)

        await mysql.commit()
    } catch (e: any) {
        console.info(event, e)
        await mysql.rollback()

        result = _genErrorResult(e.toString())
    } finally {
        if (result === undefined) {
            console.error('E00000: API 정상 작동 불가')
            throw _createError(E00000)
        }
        return _genResponse(result, event)
    }
}
