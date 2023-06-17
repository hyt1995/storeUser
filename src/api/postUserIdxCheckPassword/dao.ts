import { UserStateType } from '../../constants/enums'
import mysql from '../../utils/common/mysql'

/**
 * 비밀번호를 변경합니다.
 * @param email
 * @param password
 */
const selectUserInfo = async (email: string) => {
    const sql =
        'SELECT password, login_method as authMethod FROM users WHERE email = ? AND user_state != ?;'
    const params = [email, UserStateType.DEACTIVATED]

    const selectPasswordRes = await mysql.read(sql, params)

    if (selectPasswordRes.length !== 1) {
        return undefined
    }

    const { password, authMethod } = selectPasswordRes[0]
    return { password, authMethod }
}

const db = { selectUserInfo }
export default db
