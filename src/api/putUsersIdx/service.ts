/* eslint-disable @typescript-eslint/naming-convention */
import mysql from '../../utils/common/mysql'
import { _genServiceResult } from '../../utils/common/result'
import { IReq } from './types'

const service = async (table: string, req: IReq) => {
    const {
        params: { idx, investor_type, user_state },
        renewalToken,
    } = req

    if (user_state !== undefined) {
        const sql = `UPDATE ${table} SET user_state = ? WHERE idx = ?`
        await mysql.write(sql, [user_state, idx])
    }
    if (investor_type !== undefined) {
        const sql = `UPDATE profile SET investor_type = ? WHERE user_idx = ?`
        await mysql.write(sql, [investor_type, idx])
    }

    return _genServiceResult({
        statusCode: 200,
        data: { idx },
        renewalToken,
    })
}

export default service
