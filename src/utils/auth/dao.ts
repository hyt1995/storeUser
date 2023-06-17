import mysql from '../common/mysql'

const getStoredAccessToken = async (refreshToken: string) => {
    const sql = `SELECT access_token AS accessToken FROM auth_tokens WHERE refresh_token = ?;`
    const value = [refreshToken]
    const rows = await mysql.read(sql, value)
    if (rows.length === 0) {
        return undefined
    }

    const accessToken: string = rows[0].accessToken
    return accessToken
}

const deleteStoredTokens = async (refreshToken: string) => {
    const sql = `DELETE FROM auth_tokens WHERE refresh_token = ?;`
    const value = [refreshToken]
    await mysql.write(sql, value)
}

const refreshAccessToken = async (
    accessToken: string,
    refreshToken: string,
) => {
    const sql = `UPDATE auth_tokens SET access_token = ? WHERE refresh_token = ?;`
    const value = [accessToken, refreshToken]
    await mysql.write(sql, value)
}

const db = {
    getStoredAccessToken,
    deleteStoredTokens,
    refreshAccessToken,
}

export default db
