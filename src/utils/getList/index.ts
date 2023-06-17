import { E10001, _createError } from '../../configs/error'
import mysql from '../common/mysql'
import type { ISelectAPIParams, ISelectParams, IWhereParams } from './type'

const splitArray = (value: string | undefined) =>
    typeof value === 'string' ? value.split(',') : []

const _createSelectQuery = (selectFields: string[]) => {
    const selectQuery =
        selectFields !== undefined && selectFields.length > 0
            ? selectFields.join(', ')
            : ' * '
    return selectQuery
}

const _createFilterQuery = (filterFields: string[]) => {
    const filterQuery =
        filterFields.length > 0
            ? filterFields
                  .map((field: string) => {
                      return `${field} = ?`
                  })
                  .join(' AND ')
            : ''
    return filterQuery
}

const _createSearchQuery = (searchFields: string[]) => {
    const searchQuery =
        searchFields.length > 0
            ? searchFields
                  .map((field: string) => {
                      return `${field} LIKE CONCAT('%', ?, '%')`
                  })
                  .join(' OR ')
            : ''
    return searchQuery
}

const _createRangeQueryAndValues = (
    rangeFields: string[],
    rangeStarts: string[],
    rangeEnds: string[],
) => {
    if (
        rangeFields.length !== rangeStarts.length ||
        rangeFields.length !== rangeEnds.length
    ) {
        throw _createError(E10001)
    }

    const rangeQuery =
        rangeFields.length > 0
            ? rangeFields
                  .map((field: string, idx: number) => {
                      const queries = []
                      if (rangeStarts[idx] !== 'none') {
                          queries.push(`${field} >= ?`)
                      }
                      if (rangeEnds[idx] !== 'none') {
                          queries.push(`${field} <= ?`)
                      }
                      return queries.join(' AND ')
                  })
                  .join(' AND ')
            : ''
    const rangeValues = rangeFields
        .map((_, index) => {
            return [rangeStarts[index], rangeEnds[index]]
        })
        .flat()
    return { rangeQuery, rangeValues }
}

const _createWhereQuery = (
    filterQuery: string,
    searchQuery: string,
    rangeQuery: string,
) => {
    const findQuery = [filterQuery, searchQuery, rangeQuery]
        .filter((query) => query !== '')
        .join(' AND ')
    return findQuery !== '' ? ` WHERE ${findQuery} ` : ''
}

const _createWhereParams = (
    filterValues: string[],
    searchValues: string[],
    rangeValues: string[],
) => {
    const whereParams = [...filterValues, ...searchValues, ...rangeValues]
    return whereParams
}

const _createSortQuery = (sortBys: string[], orderBys: string[]) => {
    const sortQuery =
        sortBys.length > 0
            ? sortBys
                  .map((field, index) => {
                      return `${field} ${orderBys[index]}`
                  })
                  .join(', ')
            : ''
    const sortQueryWithOrder = sortQuery !== '' ? ` ORDER BY ${sortQuery} ` : ''
    return sortQueryWithOrder
}

const _createLimitQuery = (limit: number) => {
    const limitQuery = Number.isNaN(limit) ? '' : ` LIMIT ?, ?`
    return limitQuery
}

const _createLimitParams = (limit = 10, offset = 0) => {
    const params = Number.isNaN(limit) ? [] : [offset, limit]
    if (!Number.isNaN(limit) && Number.isNaN(offset)) {
        throw _createError(E10001)
    }
    return params.map((param) => `${param}`)
}

export const _parseSelectListParams = (params: ISelectAPIParams) => {
    const {
        offset,
        limit,
        selectFields,
        filterFields,
        filterValues,
        searchFields,
        searchValues,
        rangeFields,
        rangeStarts,
        rangeEnds,
        sortBys,
        orderBys,
    } = params

    const requiredConvertStringArrayParams = {
        searchFields,
        searchValues,
        filterFields,
        filterValues,
        rangeFields,
        rangeStarts,
        rangeEnds,
        sortBys,
        orderBys,
        selectFields,
    }

    const stringArrayParams = Object.keys(
        requiredConvertStringArrayParams,
    ).reduce((acc, key) => {
        acc[key as keyof typeof requiredConvertStringArrayParams] = splitArray(
            requiredConvertStringArrayParams[
                key as keyof typeof requiredConvertStringArrayParams
            ],
        )
        return acc
    }, {} as { [key in keyof typeof requiredConvertStringArrayParams]: string[] })

    const numberParams = {
        offset: Number(offset),
        limit: Number(limit),
    }

    return {
        ...numberParams,
        ...stringArrayParams,
    }
}

const countList = async (
    tableName: string,
    {
        filterFields,
        filterValues,
        searchFields,
        searchValues,
        rangeFields,
        rangeStarts,
        rangeEnds,
    }: IWhereParams,
) => {
    if (
        filterFields.length !== filterValues.length ||
        searchFields.length !== searchValues.length
    ) {
        _createError(E10001)
    }
    const basicQuery = `SELECT
                            COUNT(*) as count
                        FROM
                            User.${tableName}`

    const filterQuery = _createFilterQuery(filterFields)
    const searchQuery = _createSearchQuery(searchFields)
    const { rangeQuery, rangeValues } = _createRangeQueryAndValues(
        rangeFields,
        rangeStarts,
        rangeEnds,
    )
    const whereQuery = _createWhereQuery(filterQuery, searchQuery, rangeQuery)

    const sql = `${basicQuery} ${whereQuery}`
    const params = _createWhereParams(filterValues, searchValues, rangeValues)
    const count = (await mysql.read(sql, params))[0].count
    return count
}

const selectList = async (
    tableName: string,
    {
        offset,
        limit,
        selectFields,
        filterFields,
        filterValues,
        searchFields,
        searchValues,
        rangeFields,
        rangeStarts,
        rangeEnds,
        sortBys,
        orderBys,
    }: ISelectParams,
) => {
    if (
        filterFields.length !== filterValues.length ||
        searchFields.length !== searchValues.length
    ) {
        _createError(E10001)
    }

    const selectQuery = _createSelectQuery(selectFields)
    const basicQuery = `
        SELECT
            ${selectQuery}
        FROM
            User.${tableName}
    `

    const filterQuery = _createFilterQuery(filterFields)
    const searchQuery = _createSearchQuery(searchFields)
    const { rangeQuery, rangeValues } = _createRangeQueryAndValues(
        rangeFields,
        rangeStarts,
        rangeEnds,
    )

    const whereQuery = _createWhereQuery(filterQuery, searchQuery, rangeQuery)
    const whereParams = _createWhereParams(
        filterValues,
        searchValues,
        rangeValues,
    )

    const sortQuery = _createSortQuery(sortBys, orderBys)
    const limitQuery = _createLimitQuery(limit)
    const limitParams = _createLimitParams(limit, offset)

    const sql = `${basicQuery} ${whereQuery} ${sortQuery} ${limitQuery}`

    const params = [...whereParams, ...limitParams]
    const depositsWithdrawals = await mysql.read(sql, params)
    return depositsWithdrawals
}

const getList = async (tableName: string, params: ISelectParams) => {
    const count = await countList(tableName, params)
    const items = await selectList(tableName, params)
    return {
        count,
        items,
    }
}

const dao = {
    getList,
}

export default dao
