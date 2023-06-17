import type { APIGatewayEvent } from 'aws-lambda'
import { E00000, E10002, E20025, _createError } from '../../configs/error'
import { AuthMethodType } from '../../constants/enums'
import { IResult, ServiceFunctionType } from '../../types'
import { ICertificateTokenPayload, _verifyToken } from '../../utils/common/jwt'
import mysql from '../../utils/common/mysql'
import { _extractParams, _parseCookie } from '../../utils/common/request'
import { _genErrorResult, _genResponse } from '../../utils/common/result'
import { _validateEnumType } from '../../utils/common/validate'
import serviceEmail from './services/email'
import serviceGoogle from './services/google'
import serviceKakao from './services/kakao'
import serviceNaver from './services/naver'
import { IParams, IReq } from './types'

const controller = async (req: IReq): Promise<IResult> => {
    try {
        const {
            params: { serviceTerm, privateTerm },
            headers,
        } = req
        const { certificateToken } = _parseCookie(
            headers.Cookie ?? headers.cookie,
        )
        const { email, authMethod } =
            _verifyToken<ICertificateTokenPayload>(certificateToken)
        req.payload = {
            email,
            authMethod,
        }

        if (!_validateEnumType(authMethod, AuthMethodType)) {
            console.info('10002: 열거형 타입에 속하는 값이 아닙니다.')
            throw _createError(E10002)
        }

        // 필수 약관 동의 여부 확인
        const shouldAgreeTerms = [serviceTerm, privateTerm]
        shouldAgreeTerms.forEach((shouldAgreeTerm) => {
            if (shouldAgreeTerm !== true) {
                throw _createError(E20025)
            }
        })

        const services: {
            [key in AuthMethodType]: ServiceFunctionType<IReq>
        } = {
            email: serviceEmail,
            kakao: serviceKakao,
            naver: serviceNaver,
            google: serviceGoogle,
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
