import { ICertificateTokenReq } from '../../types'

export interface IParams {
    password: string
}

export type IReq = ICertificateTokenReq<IParams>
