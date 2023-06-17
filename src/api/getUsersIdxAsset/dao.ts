import mysql from '../../utils/common/mysql'

interface ICash {
    balance: number
    reward: number
    event: number
}

// 유저 잔액 조회하기
const getCash = async (user_idx: number) => {
    const sql = 'SELECT * FROM balances WHERE user_idx = ?;'
    const value = [user_idx]
    const row = (await mysql.read(sql, value))[0] as ICash
    const { balance, reward, event } = row

    const cash = balance + reward + event
    return cash
}

const db = {
    getCash,
}

export default db
