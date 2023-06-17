import { Stage } from '@ironflag/types'
import { cookieDomain } from '../../constants'
import { ICookie } from '../../types'

export const _setCookies = (cookies: ICookie[]) => {
    const result: { [key: string]: string | string[] } = {}
    const cookieList: string[] = []
    cookies.forEach((cookie) => {
        const { name, value, options } = cookie
        let cookieString = `${name}=${value}`
        if (options != null) {
            const {
                domain,
                path,
                expires,
                maxAge,
                secure,
                httpOnly,
                sameSite,
            } = options
            if (domain != null) {
                cookieString += `; Domain=${domain}`
            } else if (
                process.env.APP_ENV !== 'local' &&
                process.env.APP_ENV !== 'dev'
            ) {
                cookieString += `; Domain=${
                    cookieDomain[process.env.APP_ENV as Stage]
                }`
            }
            if (path != null) {
                cookieString += `; Path=${path}`
            } else {
                cookieString += `; Path=/`
            }
            if (expires != null) {
                cookieString += `; Expires=${expires.toUTCString()}`
            }
            if (maxAge != null) {
                cookieString += `; Max-Age=${maxAge}`
            }
            if (
                process.env.APP_ENV !== 'local' &&
                process.env.APP_ENV !== 'dev' &&
                (secure ?? false)
            ) {
                cookieString += `; Secure`
            }
            if (httpOnly ?? false) {
                cookieString += `; HttpOnly`
            }
            if (Boolean(sameSite)) {
                cookieString += `; SameSite=${sameSite}`
            }
        }
        cookieList.push(cookieString)
    })
    if (process.env.APP_ENV !== 'local') {
        result['Set-Cookie'] = cookieList
    } else {
        const keys = [
            'set-cookie',
            'Set-Cookie',
            'SET-COOKIE',
            'set-Cookie',
            'Set-cookie',
        ]
        cookieList.map((cookie, idx) => {
            result[keys[idx]] = cookie
        })
    }

    return result
}
