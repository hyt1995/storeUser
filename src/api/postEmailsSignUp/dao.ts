import { UserStateType } from '../../constants/enums'
import mysql from '../../utils/common/mysql'

/**
 * 이메일과 인증 코드 관계를 저장합니다.
 * @param email 이메일
 * @param authCode 인증코드
 */
const createNewEmailAuth = async (email: string, authCode: string) => {
    const sql = 'INSERT INTO email_auths (email, code) VALUES (?, ?);'
    const params = [email, authCode]
    const createEmailAuthRes = await mysql.write(sql, params)
    const { insertId } = createEmailAuthRes
    return insertId
}

/**
 * 해당 이메일로 일정 시간 내에 들어온 요청들을 카운트합니다.
 * @param email 이메일
 */
const countEmailAuthRequest = async (email: string) => {
    const sql =
        'SELECT COUNT(*) as count FROM email_auths WHERE email = ? AND created_at > ?;'
    const params = [email, new Date(Date.now() - 10 * 60 * 1000)]
    const selectCountRequest = await mysql.read(sql, params)
    const { count } = selectCountRequest[0]
    return count
}

const setCancelLegacyEmailAuth = async (email: string) => {
    const sql =
        'UPDATE email_auths SET state = "cancel" WHERE state = "unAuthorized" AND email = ?;'
    const params = [email]
    await mysql.write(sql, params)
}

const selectIsMember = async (email: string) => {
    const sql =
        'SELECT email as count FROM users WHERE email = ? AND user_state != ?;'
    const params = [email, UserStateType.DEACTIVATED]
    const selectEmail = await mysql.read(sql, params)

    return selectEmail.length !== 0
}

const db = {
    createNewEmailAuth,
    countEmailAuthRequest,
    setCancelLegacyEmailAuth,
    selectIsMember,
}

export default db
