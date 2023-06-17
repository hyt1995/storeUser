import mysql from '../../common/mysql'
import { _genServiceResult } from '../../common/result'

const deleteItem = async (table: string, idx: number) => {
    const sql = `DELETE FROM ${table} WHERE idx = ?`
    await mysql.write(sql, [idx])

    return _genServiceResult({
        statusCode: 200,
        data: { idx },
    })
}

export default deleteItem
