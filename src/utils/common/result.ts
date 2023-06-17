import { Severity } from '@ironflag/types'
import { APIGatewayEvent } from 'aws-lambda'
import { E00000, errorTable } from '../../configs/error'
import { allowOrigin } from '../../constants'
import { ICookie, IResult, State } from '../../types'
import { _setCookies } from './cookie'

/**
 * 성공 요청에 대한 응답을 보내는 함수
 * @param {number} statusCode 응답코드
 * @param {any} data  응답할 데이터
 * @param {any} headers  자격검증 쿠키
 * @returns {Object} 성공시 보내는 응답 객체
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const __genServiceResult_old = (
    statusCode: number,
    data: { [key: string]: any },
    headers?: { [key: string]: any },
    multiValueHeaders?: { [key: string]: any },
): IResult => {
    return {
        severity: 'information' as Severity,
        statusCode,
        data,
        headers,
        multiValueHeaders,
    }
}

/**
 * 실패 요청에 대한 응답을 보내는 함수
 * @param {string} errorCode 응답코드
 * @returns {Object} 실패시 보내는 응답 객체
 */
export const _genErrorResult = (errorMessage: string) => {
    const errorCode = errorMessage.replace('Error: ', '')

    let error = errorTable[errorCode]
    if (error === undefined) {
        error = E00000
    }

    const { severity, statusCode } = error
    const language = 'ko'

    return {
        severity,
        statusCode,
        data: {
            status: 'failed',
            errorCode: error.errorCode,
            errorString: error.message[language],
        },
    }
}

/**
 * API 응답값을 반환합니다.
 * @param result 서비스 결과값
 * @returns API 응답
 */
export const _genResponse = (result: IResult, event: APIGatewayEvent) => {
    const { statusCode, data, headers, multiValueHeaders } = result

    const origin =
        event.headers.Origin ?? event.headers.origin ?? 'https://localhost:3000'
    const hostname = new URL(origin).hostname

    const corsHeaders = allowOrigin[process.env.APP_ENV as State].includes(
        hostname,
    )
        ? {
              'Access-Control-Allow-Origin': origin,
              'Access-Control-Allow-Credentials': 'true',
          }
        : undefined

    return {
        statusCode,
        body: JSON.stringify(data),
        headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            ...headers,
        },
        multiValueHeaders: {
            ...multiValueHeaders,
        },
    }
}

interface IGenServiceResult {
    statusCode: number
    data: { [key: string]: any }
    severity?: Severity
    renewalToken?: string
    cookies?: ICookie[]
    headers?: { [key: string]: any }
    multiValueHeaders?: { [key: string]: any }
}
export const _genServiceResult = ({
    statusCode,
    data,
    severity = 'information',
    renewalToken,
    cookies = [],
    headers = {},
    multiValueHeaders,
}: IGenServiceResult): IResult => {
    let cookiesObj
    if (cookies.length > 0 || renewalToken !== '') {
        cookiesObj = _setCookies([
            ...cookies,
            ...(renewalToken !== undefined
                ? [
                      {
                          name: 'accessToken',
                          value: renewalToken,
                          options: {
                              httpOnly: true,
                              secure: true,
                          },
                      },
                  ]
                : []),
        ])
    }
    if (process.env.APP_ENV === 'local') {
        headers = {
            ...headers,
            ...cookiesObj,
        }
    } else {
        multiValueHeaders = {
            ...multiValueHeaders,
            ...cookiesObj,
        }
    }
    return {
        severity,
        statusCode,
        data,
        headers,
        multiValueHeaders,
    }
}
