import { UserStateType } from '../../constants/enums'
import mysql from '../../utils/common/mysql'

/**
 * email로 정보를 조회하기
 * @param {string} email 이메일
 * @param {Connection} connection DB 커넥션 객체
 * @returns 이메일로 users 테이블 조회 결과 반환
 */
const checkEmailExistence = async (email: string) => {
    const sql = 'SELECT * FROM users WHERE email = ? AND user_state != ?;'
    const value = [email, UserStateType.DEACTIVATED]
    const selectEmail = await mysql.read(sql, value)

    return selectEmail.length === 1
}

const db = {
    checkEmailExistence,
}

export default db
