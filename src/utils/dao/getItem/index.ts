import mysql from '../../common/mysql'
import { _genServiceResult } from '../../common/result'

const getItem = async (table: string, idx: number) => {
    const sql = `SELECT * FROM ${table} WHERE idx = ?`
    const data = await mysql.read(sql, [idx])

    delete data[0].password

    return _genServiceResult({
        statusCode: 200,
        data: data[0],
    })
}

export default getItem
