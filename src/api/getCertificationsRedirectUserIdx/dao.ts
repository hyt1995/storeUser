import { UserStateType } from '../../constants/enums'
import mysql from '../../utils/common/mysql'

interface ICheckIsRegistered {
    phone: string
}
const checkIsRegistered = async ({ phone }: ICheckIsRegistered) => {
    const sql = `
        SELECT
            *
        FROM
            users as u
        LEFT JOIN
            profile as p
        ON
            u.idx = p.user_idx 
        WHERE 
            u.user_state != ? AND p.phone = ?
    ;`
    const params = [UserStateType.DEACTIVATED, phone]

    const response = await mysql.write(sql, params)
    if (response.length >= 1) return true
    return false
}

interface IUpdateProfile {
    name: string
    gender: string
    birthday: string
    phone: string
}
/**
 * 프로필 정보를 변경합니다.
 */
const updateProfile = async (userIdx: number, profile: IUpdateProfile) => {
    const { name, gender, birthday, phone } = profile
    const sql = `
        UPDATE
            profile
        SET
            name = ?, gender = ?, birth = ?, phone = ?
        WHERE
            user_idx = ?
    `
    const params = [name, gender, birthday, phone, userIdx]

    await mysql.write(sql, params)
}

/**
 * 사용자 상태를 변경합니다.
 * @param userIdx
 */
const updateUserState = async (userIdx: number) => {
    const sql = `
        UPDATE
            users
        SET
            user_state = ?
        WHERE
            idx = ?
    `
    const params = [UserStateType.NORMAL, userIdx]

    await mysql.write(sql, params)
}

/**
 * 인증 상태를 변경합니다.
 * @param userIdx
 */
const updateAuthState = async (userIdx: number) => {
    const sql = `
        UPDATE
            auth_states
        SET
            phone_verified = ?
        WHERE
            user_idx = ?
    `
    const params = [true, userIdx]

    await mysql.write(sql, params)
}

const db = {
    checkIsRegistered,
    updateProfile,
    updateUserState,
    updateAuthState,
}
export default db
