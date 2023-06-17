import mysql from '../../utils/common/mysql'

interface IParams {
    user_idx: number
    product_idx: number
}

const insertFavorite = async ({ user_idx, product_idx }: IParams) => {
    const sql = `
        INSERT INTO favorites (user_idx, product_idx)
        SELECT ?, ?
        FROM DUAL
        WHERE NOT EXISTS (
            SELECT *
            FROM favorites
            WHERE user_idx = ? AND product_idx = ?
        )
    `

    return await mysql.write(sql, [
        user_idx,
        product_idx,
        user_idx,
        product_idx,
    ])
}

const deleteFavorite = async ({ user_idx, product_idx }: IParams) => {
    const sql = `
        DELETE FROM favorites
        WHERE user_idx = ? AND product_idx = ?
    `
    return await mysql.write(sql, [user_idx, product_idx])
}

const db = {
    insertFavorite,
    deleteFavorite,
}

export default db
