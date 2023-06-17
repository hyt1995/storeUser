import type { IBaseReq } from '../../types'

export interface IParams {
    idx: string
    product_idx: number
    isFavorite: boolean
}

export type IReq = IBaseReq<IParams>
