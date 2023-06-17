import { IBaseReq } from '../../types'

export interface IParams {
    imp_uid: string
    userIdx: number
    success: boolean
}

export type IReq = IBaseReq<IParams>
