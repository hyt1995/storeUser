/**
 * 간단한 email check 함수
 * @param {string} email - 유저 이메일을 보낸다.
 * @returns {boolean} 이메일 유효성 검사 결과 반환
 */
export const _validateEmail = (email: string) => {
    const regex =
        /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
    return email !== '' && email !== 'undefined' && regex.test(email)
}

/**
 * 패스워드 유효성을 검사하는 함수입니다.
 * @param {string} password 비밀번호
 * @returns {boolean} 비밀번호 유효성 검사 결과 반환
 */
export const _validatePassword = (password: string) => {
    const reg =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!-\/:-@\[-`{-~])[A-Za-z\d[!-\/:-@\[-`{-~\]]{10,32}$/

    if (!reg.test(password)) {
        console.info(
            '비밀번호는 10자 이상이어야 하며, 숫자/대문자/소문자/특수문자를 모두 포함해야 합니다.',
        )
        return false
    }
    return true
}

export const _validateEnumType = (
    element: any,
    enumType: { [key: string]: any },
) => {
    const isInclude = Object.values(enumType).includes(element)
    return isInclude
}

export const _validateEnumTypeByArray = (
    elements: any[],
    enumType: { [key: string]: any },
) => {
    for (const element of elements) {
        const isInclude = Object.values(enumType).includes(element)
        if (!isInclude) {
            return false
        }
    }
    return true
}
