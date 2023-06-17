import mysql from '../../utils/common/mysql'

/** 유저 상태 변경 */
/**
 * User.users 테이블 내 유저 상태를 변경
 * @param state 유저 상태
 * @param userIdx 유저 idx
 * @returns rows
 */
const updateUserState = async (state: string, userIdx: number) => {
    const sql = 'UPDATE users SET user_state = ? WHERE idx = ?;'
    const value = [state, userIdx]
    const rows = await mysql.write(sql, value)

    return rows
}

/**
 * User.terms 테이블 자진삭감 동의 저장
 * @param assetAbandonTerm 자진삭감 동의 여부
 * @param userIdx 유저 idx
 * @returns rows
 */
const updateAssetAbandonTerm = async (
    assetAbandonTerm: boolean,
    userIdx: number,
) => {
    const sql = 'UPDATE terms SET asset_abandon_term = ? WHERE user_idx = ?;'
    const value = [assetAbandonTerm, userIdx]
    const rows = await mysql.write(sql, value)

    return rows
}

/**
 * User.balances 테이블 내 자산을 0으로 변경
 * @param userIdx 유저 idx
 * @returns rows
 */
const updateBalanceToZero = async (userIdx: number) => {
    const sql =
        'UPDATE balances SET balance = ?, reward = ?, event = ? WHERE user_idx = ?;'
    const value = [0, 0, 0, userIdx]
    const rows = await mysql.write(sql, value)

    return rows
}

const db = {
    updateUserState,
    updateAssetAbandonTerm,
    updateBalanceToZero,
}

export default db
