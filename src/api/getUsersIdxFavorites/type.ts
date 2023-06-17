import type { IBaseReq } from '../../types'
import type { ISelectAPIParams } from '../../utils/getList/type'

export interface IParams extends ISelectAPIParams {
    idx: string
}

export type IReq = IBaseReq<IParams>
