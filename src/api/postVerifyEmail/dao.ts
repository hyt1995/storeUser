import { RowDataPacket } from 'mysql2/promise'
import mysql from '../../utils/common/mysql'

/**
 * 이메일 인증 코드를 조회합니다.
 * @param email 이메일
 * @returns
 */
const getEmailAuthCode = async (email: string) => {
    const sql =
        'SELECT code FROM email_auths WHERE state = "unAuthorized" AND email = ?;'
    const params = [email]
    const selectEmailAuthCodeRes = (await mysql.write(
        sql,
        params,
    )) as RowDataPacket[]
    if (selectEmailAuthCodeRes.length === 0) {
        return undefined
    }

    const { code } = selectEmailAuthCodeRes[0]
    return code as string
}

const updateAuthorizedEmailAuth = async (email: string) => {
    const sql =
        'UPDATE email_auths SET state = "authorized" WHERE state = "unAuthorized" AND  email = ?;'
    const params = [email]
    await mysql.write(sql, params)
}

const db = {
    getEmailAuthCode,
    updateAuthorizedEmailAuth,
}

export default db
