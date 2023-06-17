import { IBaseReq } from '../../../types'

export interface IGetListParams {
    email?: string
    password?: string
    limit: number
    offset: number
    selectFields: string[]
    filterFields: string[]
    filterValues: string[]
    searchFields: string[]
    searchValues: string[]
    rangeFields: string[]
    rangeStarts: string[]
    rangeEnds: string[]
    orderBys: string[]
    sortBys: string[]
}

export interface ITableConfig {
    name: string
    alias?: string
    key?: string
    fields?: string[]
}

export type IReq = IBaseReq<IGetListParams>
