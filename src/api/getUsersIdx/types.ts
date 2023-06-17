import { IBaseReq } from '../../types'

export interface IParams {
    idx: string
}

export type IReq = IBaseReq<IParams>
