import mysql from '../../utils/common/mysql'

interface IDeleteAuthToken {
    refreshToken: string
}
const deleteAuthToken = async (params: IDeleteAuthToken) => {
    const { refreshToken } = params

    const table = 'User.auth_tokens'
    const tableAlias = 'a'
    const whereQuery = 'a.refresh_token = ?'

    const query = `DELETE FROM ${table} as ${tableAlias} WHERE ${whereQuery}`
    const value = [refreshToken]

    const result = await mysql.write(query, value)

    return result
}

const db = {
    deleteAuthToken,
}

export default db
