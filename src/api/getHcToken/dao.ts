import mysql from '../../utils/common/mysql'

const selectUser = async (idx: number) => {
    const sql =
        'SELECT email,name FROM `User`.`users` as u LEFT JOIN `User`.`profile` as p ON u.idx = p.user_idx WHERE u.idx = ?;'
    const value = [idx]
    const userData = (await mysql.read(sql, value))[0]

    return userData
}

const db = {
    selectUser,
}

export default db
