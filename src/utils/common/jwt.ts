import jwt from 'jsonwebtoken'
import { E20002, _createError } from '../../configs/error'
import jwtConfig from '../../configs/jwt'
import { AuthMethodType } from '../../constants/enums'

/**
 * 인증 토큰을 생성합니다.
 * @param body
 * @param expiresIn
 * @returns
 */
export const _genCertificateToken = (
    email: string,
    authMethod: AuthMethodType,
) => {
    const payload = {
        email,
        authMethod,
        iat: Math.floor(new Date().getTime() / 1000),
    }

    const option = {
        expiresIn: jwtConfig.certificate.expiresIn,
        ...jwtConfig.commonOption,
    }

    const token = jwt.sign(payload, jwtConfig.commonSecret, option)
    return token
}

/**
 * Access 토큰을 생성합니다.
 * @param body
 * @param expiresIn
 * @returns
 */
export const _genAccessToken = (
    userIdx: number,
    email: string,
    isAdmin = false,
) => {
    const payload = {
        userIdx,
        email,
        isAdmin,
        iat: Math.floor(new Date().getTime() / 1000),
    }

    const option = {
        expiresIn: jwtConfig.access.expiresIn,
        ...jwtConfig.commonOption,
    }

    const token = jwt.sign(payload, jwtConfig.commonSecret, option)
    return token
}

/**
 * Refresh 토큰을 생성합니다.
 * @param body
 * @param expiresIn
 * @returns
 */
export const _genRefreshToken = (
    userIdx: number,
    email: string,
    autoLogin: boolean,
    isAdmin = false,
) => {
    const payload = {
        userIdx,
        email,
        isAdmin,
        iat: Math.floor(new Date().getTime() / 1000),
    }

    const option = {
        expiresIn:
            autoLogin === true
                ? jwtConfig.longRefresh.expiresIn
                : jwtConfig.shortRefresh.expiresIn,
        ...jwtConfig.commonOption,
    }

    const token = jwt.sign(payload, jwtConfig.commonSecret, option)
    return token
}

/**
 * sns_auth 토큰 암호화
 * @param {string} email  유저 이메일을 보낸다.
 * @returns {string} sns_auth table token
 */
export const _setCertificateToken = async (
    email: string,
    authMethod: AuthMethodType,
): Promise<string> => {
    const payload = {
        email,
        authMethod,
        iat: Date.now(),
    }

    const option = {
        expiresIn: jwtConfig.certificate.expiresIn,
        ...jwtConfig.commonOption,
    }

    const token = jwt.sign(payload, jwtConfig.commonSecret, option)
    return token
}

/**
 * 토큰의 유효성을 검사하고 해석값을 반환합니다.
 * @param {string} token 토큰을 보낸다.
 * @returns {Object} {
 *      userIdx : 1
 *      email : "dddd@gmail.com"
 *      name : "dddd"
 *      is_verified : false
 *  }
 */
export const _verifyToken = <T>(token: string) => {
    try {
        const decode = jwt.verify(token, jwtConfig.commonSecret)
        return decode as T
    } catch (e) {
        throw e
    }
}

/**
 * 토큰의 유효성을 검사하고 해석값을 반환합니다.
 * @param {string} token 토큰을 보낸다.
 * @returns {Object} {
 *      userIdx : 1
 *      email : "dddd@gmail.com"
 *      name : "dddd"
 *      is_verified : false
 *  }
 */
export const _decodeToken = <T>(token: string) => {
    try {
        const decode = jwt.decode(token)
        return decode as T
    } catch (e) {
        console.info('e: ', e)
        throw _createError(E20002)
    }
}

export interface ICertificateTokenPayload extends jwt.Jwt {
    email: 'string'
    authMethod: AuthMethodType
    exp: number
}
