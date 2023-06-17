import type { APIGatewayEvent } from 'aws-lambda'
import { E10004, _createError } from '../../configs/error'
import { IBaseReq, ITokenPayload } from '../../types'
import qs from 'qs'

// eslint-disable-next-line @typescript-eslint/naming-convention
export const __parseCookie_old = (str = '') => {
    if (str === '') {
        return {}
    }
    return str
        .split(';')
        .map((v) => v.split('='))
        .reduce((acc: any, v: any) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(
                v[1].trim(),
            )
            return acc
        }, {})
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const __extractParams_old = <T>(
    event: APIGatewayEvent,
    auth = {},
): T => {
    const validBody = Boolean(event.body) ? event.body : JSON.stringify({})
    const bodyParams = JSON.parse(validBody as string)
    const pathParams = event.pathParameters ?? {}
    const queryParams =
        qs.parse(qs.stringify(event.queryStringParameters)) ?? {}

    const params = {
        ...bodyParams,
        ...pathParams,
        ...queryParams,
        auth,
    }

    return params as T
}

export const _extractCookieObj = (event: APIGatewayEvent) => {
    const { cookie } = event.headers
    if (typeof cookie !== 'string') {
        throw _createError(E10004)
    }

    return __parseCookie_old(cookie)
}

export const _parseCookie = (str: string | undefined) => {
    if (str === undefined) return {}
    const obj: { [key: string]: any } = {}
    const pairs = str.split(/\;\s*/g)
    for (const pair of pairs) {
        const [key, value] = pair.split('=')
        obj[key] = value
    }

    return obj
}

interface IExtractParamsOption {
    payload?: ITokenPayload
    renewalToken?: string
}
export const _extractParams = <T>(
    event: APIGatewayEvent,
    { payload, renewalToken = '' }: IExtractParamsOption = {},
): IBaseReq<T> => {
    const validBody = Boolean(event.body) ? event.body : JSON.stringify({})
    const bodyParams = JSON.parse(validBody as string)
    const pathParams = event.pathParameters ?? {}
    const queryParams =
        qs.parse(qs.stringify(event.queryStringParameters)) ?? {}
    const headers = event.headers ?? {}
    const cookies = _parseCookie(headers.Cookie ?? headers.cookie)

    const params = {
        params: {
            ...bodyParams,
            ...pathParams,
            ...queryParams,
        },
        headers,
        cookies,
        payload: payload as ITokenPayload,
        renewalToken,
    }

    return params
}
