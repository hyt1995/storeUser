import { IBaseReq } from '../../types'

export interface IParams {
    email: string
    code: string
}

export type IReq = IBaseReq<IParams>
