import mysql from '../../common/mysql'
import { _genServiceResult } from '../../common/result'
import { IReq, ITableConfig } from './types'

const getList = async (
    req: IReq,
    tableConfigs: ITableConfig[],
    orderByCreateAt = true,
) => {
    const { params, renewalToken } = req
    const {
        limit,
        offset,
        selectFields,
        filterFields,
        filterValues,
        searchFields,
        searchValues,
        rangeFields,
        rangeStarts,
        rangeEnds,
        orderBys,
        sortBys,
    } = params

    const aliasPrefix = (field: string) => {
        let joinedName = field
        tableConfigs.forEach((table) => {
            if (Boolean(table.fields?.includes(field))) {
                joinedName = `${table.alias}.${field}`
            }
        })
        return joinedName
    }

    const selectFieldsStr =
        selectFields?.length > 0
            ? selectFields.reduce((acc, cur) => {
                  return `${acc}, ${aliasPrefix(cur)}`
              })
            : '*'

    const tableAliases = tableConfigs.reduce((acc, cur, idx, tables) => {
        if (idx === 0) {
            return `${cur.name} ${cur.alias}`
        }
        return `${acc} LEFT JOIN ${cur.name} ${cur.alias} ON ${
            tables[idx - 1].alias
        }.${tables[idx - 1].key} = ${cur.alias}.${cur.key}`
    }, '')

    const basicQuery = `SELECT ${selectFieldsStr} from ${tableAliases} `

    const countQuery = `SELECT COUNT(*) as count from ${tableAliases}`

    let orderQuery = ''
    if (sortBys?.length > 0) {
        const sorts = sortBys.reduce((acc, cur, idx) => {
            const clause = `${aliasPrefix(cur)} ${orderBys?.[idx] ?? 'ASC'}`
            if (idx === 0) {
                return `ORDER BY ${clause}`
            }
            return `${acc}, ${clause}`
        }, '')
        orderQuery = sorts
    } else {
        orderQuery = orderByCreateAt ? `ORDER BY created_at desc` : ''
    }

    const limitQuery = `LIMIT ${offset ?? 0}, ${limit ?? 10}`

    const whereQueryArr: string[] = []

    if (filterFields?.length > 0 && filterValues.length > 0) {
        const filters = filterFields.reduce((acc, cur, idx) => {
            const clause = `${aliasPrefix(cur)} = "${filterValues?.[idx]}"`
            if (idx === 0) {
                return clause
            }
            return `${acc} AND ${clause}`
        }, '')
        whereQueryArr.push(filters)
    }

    if (searchFields?.length > 0 && searchValues.length > 0) {
        const searches = searchFields.reduce((acc, cur, idx) => {
            const clause = `${aliasPrefix(cur)} LIKE "%${searchValues?.[idx]}%"`
            if (idx === 0) {
                return clause
            }
            return `${acc} OR ${clause}`
        }, '')
        whereQueryArr.push(searches)
    }

    if (rangeFields?.length > 0) {
        const ranges = rangeFields.reduce((acc, cur, idx) => {
            let clause = ''
            if (Boolean(rangeStarts?.[idx]) && Boolean(rangeEnds?.[idx])) {
                clause = `${aliasPrefix(cur)} BETWEEN "${
                    rangeStarts?.[idx]
                }" AND "${rangeEnds?.[idx]}"`
            }
            if (
                (!Boolean(rangeStarts?.[idx]) ||
                    rangeStarts?.[idx] === 'none') &&
                Boolean(rangeEnds?.[idx])
            ) {
                clause = `${aliasPrefix(cur)} <= "${rangeEnds?.[idx]}"`
            }
            if (
                Boolean(rangeStarts?.[idx]) &&
                (!Boolean(rangeEnds?.[idx]) || rangeEnds?.[idx] === 'none')
            ) {
                clause = `${aliasPrefix(cur)} >= "${rangeStarts?.[idx]}"`
            }
            if (idx === 0) {
                return clause
            }
            return `${acc} AND ${clause}`
        }, '')
        whereQueryArr.push(ranges)
        console.log('ranges: ', ranges)
    }

    const whereQuery =
        whereQueryArr.length > 0 ? ` WHERE ${whereQueryArr.join(' AND ')} ` : ''

    const itemsSql = `${basicQuery} ${whereQuery} ${orderQuery} ${limitQuery}`
    const countSql = `${countQuery} ${whereQuery}`

    const items = await mysql.read(itemsSql, [])
    const countData = await mysql.read(countSql, [])

    // ?후처리 - 비밀번호 제거, 날짜 포맷 변경 (날짜 포맷은 걍 이대로)
    items?.map((item) => {
        delete item.password
        // item.created_at = new Date(item.created_at).getTime()
    })

    return _genServiceResult({
        statusCode: 200,
        data: {
            count: countData?.[0].count,
            items,
            limit: Number(limit),
            offset: Number(offset),
        },
        renewalToken,
    })
}

export default getList
