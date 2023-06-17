import { IBaseReq } from '../../types'

export interface IParams {
    imp_uid: string
    user_idx: number
}

export type IReq = IBaseReq<IParams>
