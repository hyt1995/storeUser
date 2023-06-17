import { IBaseReq } from '../../types'

export interface IParams {
    email: string
}

export type IReq = IBaseReq<IParams>
