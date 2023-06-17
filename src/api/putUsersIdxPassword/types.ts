import { IBaseReq } from '../../types'

export interface IParams {
    idx: number
    password: string
}

export type IReq = IBaseReq<IParams>
