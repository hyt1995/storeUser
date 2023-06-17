import { IBaseReq } from '../../types'

export interface IParams {
    idx: number
}

export type IReq = IBaseReq<IParams>
