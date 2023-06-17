import mysql from '../../common/mysql'
import { _genServiceResult } from '../../common/result'

const postItem = async (table: string, params: { [key: string]: any }) => {
    const sql = `INSERT INTO ${table} (${Object.keys(params)}) 
        VALUES (${Object.keys(params).map(() => `?`)})`

    const values = Object.values(params).map(
        (val) => `${typeof val === 'object' ? JSON.stringify(val) : val}`,
    )

    const data = await mysql.write(sql, values)

    return _genServiceResult({
        statusCode: 200,
        data: { idx: data.insertId },
    })
}

export default postItem
