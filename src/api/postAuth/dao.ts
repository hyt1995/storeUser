import { UserStateType } from '../../constants/enums'
import mysql from '../../utils/common/mysql'

interface SelectUserInfoReturn {
    password: string
    idx: number
    authMethod: string
    user_state: UserStateType
}
/**
 * 이메일 존재 여부를 조회합니다.
 * @param email
 * @returns
 */
const selectUserInfo = async (
    email: string,
): Promise<SelectUserInfoReturn | null> => {
    const sql =
        'SELECT password, idx, user_state, login_method as authMethod FROM users WHERE email = ?;'
    const value = [email]

    const userInfo = await mysql.read(sql, value)
    if (userInfo.length === 0) return null

    const accessibleData = userInfo.find(
        (v) =>
            v.user_state === UserStateType.NORMAL ||
            v.user_state === UserStateType.WAITING,
    )
    if (accessibleData === undefined) return userInfo[0] as SelectUserInfoReturn

    const { password, idx, authMethod, user_state } = accessibleData
    return { password, idx, authMethod, user_state }
}

/**
 * 권한 토큰을 저장합니다.
 * @param accessToken 액세스 토큰
 * @param refreshToken 리프레시 토큰
 * @returns
 */
const saveAuthToken = async (accessToken: string, refreshToken: string) => {
    const sql =
        'INSERT INTO auth_tokens (access_token, refresh_token) VALUES (?, ?) ON DUPLICATE KEY UPDATE access_token = ?, refresh_token =?;'
    const value = [accessToken, refreshToken, accessToken, refreshToken]
    const rows = await mysql.write(sql, value)

    return rows
}

const db = {
    selectUserInfo,
    saveAuthToken,
}

export default db
