import mysql from '../../utils/common/mysql'

const _objectWithoutProperties = (
    source: { [key: string]: any },
    excluded: string[],
) => {
    const target: { [key: string]: any } = {}
    const sourceKeys = Object.keys(source)

    sourceKeys.forEach((key) => {
        if (excluded.includes(key)) return
        target[key] = source[key]
    })

    return target
}

const selectUser = async (idx: string) => {
    const table1 = 'User.users'
    const table2 = 'User.profile'
    const table3 = 'User.auth_states'
    const sql = `SELECT *
        FROM ${table1} as u
        LEFT JOIN ${table2} as p ON u.idx = p.user_idx
        LEFT JOIN ${table3} as a ON u.idx = a.user_idx
        WHERE u.idx = ?;`
    const value = [idx]
    const userData = (await mysql.read(sql, value))[0]
    const result = _objectWithoutProperties(userData, ['password', 'user_idx'])
    result.phone_verified = result.phone_verified === 1
    result.otp_enabled = result.otp_enabled === 1
    result.kyc_verified = result.kyc_verified === 1

    return result
}

const db = {
    selectUser,
}

export default db
