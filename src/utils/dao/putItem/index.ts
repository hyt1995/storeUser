import mysql from '../../common/mysql'
import { _genServiceResult } from '../../common/result'
import { IReq } from '../types'

const putItem = async (table: string, req: IReq) => {
    const { params, renewalToken } = req
    const idx = params.idx
    const updateStr = Object.keys(params).reduce((acc, cur, idx) => {
        const clause =
            typeof params[cur] === 'object'
                ? `${cur} = '${JSON.stringify(params[cur])}'`
                : `${cur} = "${params[cur]}"`
        if (idx === 0) {
            return clause
        }
        return `${acc}, ${clause}`
    }, '')
    const sql = `UPDATE ${table} SET ${updateStr} WHERE idx = ?`
    await mysql.write(sql, [idx])

    return _genServiceResult({
        statusCode: 200,
        data: { idx },
        renewalToken,
    })
}

export default putItem
