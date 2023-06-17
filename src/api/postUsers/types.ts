import { ICertificateTokenReq } from '../../types'

export interface IParams {
    password: string
    serviceTerm: boolean
    privateTerm: boolean
    marketingTerm: boolean
}

export type IReq = ICertificateTokenReq<IParams>
