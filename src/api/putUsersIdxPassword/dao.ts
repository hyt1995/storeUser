import mysql from '../../utils/common/mysql'

const selectPassword = async (idx: number) => {
    const table = 'users'
    const selectFields = ['password']
    const sql = `SELECT ${selectFields} FROM ${table} WHERE idx = ?;`
    const params = [String(idx)]

    const result = (await mysql.write(sql, params))[0].password
    return result
}

const updatePassword = async (idx: number, hashedPassword: string) => {
    const sql = 'UPDATE `User`.`users` SET password = ? WHERE idx = ?;'
    const params = [hashedPassword, String(idx)]

    const result = await mysql.write(sql, params)
    return result
}

const db = { selectPassword, updatePassword }
export default db
