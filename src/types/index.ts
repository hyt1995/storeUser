import type { Severity } from '@ironflag/types'
import { APIGatewayProxyEventHeaders } from 'aws-lambda'
import type { JwtPayload } from 'jsonwebtoken'
import { AuthMethodType } from '../constants/enums'

export interface IResult {
    severity?: Severity
    statusCode: number
    headers?: { [key: string]: any }
    multiValueHeaders?: { [key: string]: any }
    data: { [key: string]: any }
}

export type ServiceFunctionType<T> = (params: T) => Promise<IResult>

export interface IRefreshTokenPayload extends JwtPayload {
    userIdx: number
    email: string
}

export interface IAccessTokenPayload extends JwtPayload {
    userIdx: number
    email: string
}

export interface ICertificateTokenPayload {
    email: string
    authMethod: AuthMethodType
}

export type State = 'local' | 'dev' | 'qa' | 'hotfix' | 'prod'

export interface ITokenPayload {
    userIdx: number
    email: string
    isAdmin: boolean
    iat: number
    exp: number
    iss: string
    sub: string
}

export interface IBaseReq<T> {
    params: T
    headers: APIGatewayProxyEventHeaders
    cookies: { [key: string]: string }
    payload: ITokenPayload
    renewalToken: string
}

export interface ICertificateTokenReq<T> {
    params: T
    headers: APIGatewayProxyEventHeaders
    cookies: { [key: string]: string }
    payload: ICertificateTokenPayload
    renewalToken: string
}

export interface ICookie {
    name: string
    value: string
    options?: {
        domain?: string
        path?: string
        expires?: Date
        maxAge?: number
        secure?: boolean
        httpOnly?: boolean
        sameSite?: boolean | 'lax' | 'strict' | 'none'
    }
}
