interface IPaginationFields {
    limit: number
    offset: number
}

interface ISortFields {
    sortBys: string[]
    orderBys: string[]
}

interface IRangeFields {
    rangeFields: string[]
    rangeStarts: string[]
    rangeEnds: string[]
}

interface IFilterFields {
    filterFields: string[]
    filterValues: string[]
}

interface ISearchFields {
    searchFields: string[]
    searchValues: string[]
}

interface ISelectFields {
    selectFields: string[]
}

export interface IWhereParams
    extends IRangeFields,
        IFilterFields,
        ISearchFields {}

export interface ISelectParams
    extends IWhereParams,
        IPaginationFields,
        ISortFields,
        ISelectFields {}

export interface ISelectAPIParams extends IPaginationFields {
    selectFields: string
    filterFields: string
    filterValues: string
    searchFields: string
    searchValues: string
    rangeFields: string
    rangeStarts: string
    rangeEnds: string
    sortBys: string
    orderBys: string
}
