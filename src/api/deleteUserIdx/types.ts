import { IBaseReq } from '../../types'

export interface IParams {
    idx: string
    assetAbandonTerm: boolean
}

export type IReq = IBaseReq<IParams>
