import { AuthMethodType, UserStateType } from '../../constants/enums'
import mysql from '../../utils/common/mysql'

/**
 * email로 정보를 조회하기
 * @param {string} email 이메일
 * @param {Connection} connection DB 커넥션 객체
 * @returns {Object} 이메일로 users 테이블 조회 결과 반환
 */
const selectEmailExist = async (email: string) => {
    const sql = 'SELECT * FROM users WHERE email = ?;'
    const value = [email]
    const selectEmailExistRes = await mysql.read(sql, value)

    const isEmailExist = selectEmailExistRes.length !== 0
    return isEmailExist
}

/**
 * 회원을 추가합니다.
 * @param email
 * @param state
 * @param authMethod
 * @returns
 */
const addNewSnsUser = async (
    email: string,
    state: string,
    authMethod: string,
) => {
    const sql =
        'INSERT INTO users (email, user_state, login_method) values (?, ?, ?);'
    const values = [email, state, authMethod]
    const { insertId } = await mysql.write(sql, values)

    return insertId
}

// 이메일, 패스워드, 상태 저장하기
const addNewEmailUser = async (email: string, password: string) => {
    const sql =
        'INSERT INTO users (email, password, user_state, login_method) VALUES (?, ?, ?, ?);'
    const values = [
        email,
        password,
        UserStateType.WAITING,
        AuthMethodType.EMAIL,
    ]
    const { insertId } = await mysql.write(sql, values)

    return insertId
}

/**
 * 해당 email이 존재하는 지 검사합니다.
 * @param email
 * @return
 */
const checkExistEmail = async (email: string) => {
    const sql = 'SELECT email FROM users WHERE email = ? AND user_state != ?;'
    const params = [email, UserStateType.DEACTIVATED]
    const selectEmailResult = await mysql.read(sql, params)

    if (selectEmailResult.length === 1) {
        return true
    }

    return false
}

const createBalance = async (userIdx: number) => {
    const sql = 'INSERT INTO `User`.`balances` (user_idx) VALUES (?)'
    const params = [userIdx]
    await mysql.write(sql, params)
}

interface ICreateTerms {
    userIdx: number
    serviceTerm: boolean
    privateTerm: boolean
    marketingTerm: boolean
}
const createTerms = async ({
    userIdx,
    serviceTerm,
    privateTerm,
    marketingTerm,
}: ICreateTerms) => {
    const sql =
        'INSERT INTO `User`.`terms` (user_idx, service_term, private_term, marketing_term) VALUES (?, ?, ?, ?)'
    const params = [userIdx, serviceTerm, privateTerm, Boolean(marketingTerm)]

    await mysql.write(sql, params)
}

interface ICreateProfile {
    userIdx: number
}
const createProfile = async ({ userIdx }: ICreateProfile) => {
    const sql = 'INSERT INTO `User`.`profile` (user_idx) VALUES (?)'
    const params = [userIdx]

    await mysql.write(sql, params)
}

interface ICreateAuthStates {
    userIdx: number
}
const createAuthStates = async ({ userIdx }: ICreateAuthStates) => {
    const sql = 'INSERT INTO `User`.`auth_states` (user_idx) VALUES (?)'
    const params = [userIdx]

    await mysql.write(sql, params)
}

const saveAuthToken = async (accessToken: string, refreshToken: string) => {
    const sql =
        'INSERT INTO auth_tokens (access_token, refresh_token) VALUES (?, ?) ON DUPLICATE KEY UPDATE access_token = ?, refresh_token =?;'
    const value = [accessToken, refreshToken, accessToken, refreshToken]
    const rows = await mysql.write(sql, value)

    return rows
}

const db = {
    selectEmailExist,
    addNewSnsUser,
    addNewEmailUser,
    checkExistEmail,
    createBalance,
    createTerms,
    createProfile,
    createAuthStates,
    saveAuthToken,
}

export default db
