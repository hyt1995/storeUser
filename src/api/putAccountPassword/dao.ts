import { UserStateType } from '../../constants/enums'
import mysql from '../../utils/common/mysql'

/**
 * 비밀번호를 변경합니다.
 * @param email sd
 * @param password
 */
const updatePassword = async (email: string, encryptedPassword: string) => {
    const sql =
        'UPDATE users SET password = ? WHERE email = ? AND user_state != ?;'
    const params = [encryptedPassword, email, UserStateType.DEACTIVATED]

    await mysql.write(sql, params)
}

const db = { updatePassword }
export default db
