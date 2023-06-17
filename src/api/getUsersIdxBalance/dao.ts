import mysql from '../../utils/common/mysql'

// 유저 잔액 조회하기
const getBalanceDeo = async (idx: number) => {
    const sql = 'SELECT * FROM balances WHERE user_idx = ?;'
    const value = [idx]
    const row = (await mysql.read(sql, value))[0]

    return row
}

const db = {
    getBalanceDeo,
}

export default db
