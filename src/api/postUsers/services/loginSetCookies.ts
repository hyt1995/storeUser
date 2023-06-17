import { ICookie } from '../../../types'
import { _genAccessToken, _genRefreshToken } from '../../../utils/common/jwt'
import db from '../dao'

export default async function loginSetCookies(
    userIdx: any,
    email: string,
    isAutoLogin = false,
) {
    const accessToken = _genAccessToken(userIdx, email)
    const refreshToken = _genRefreshToken(userIdx, email, isAutoLogin)

    // auth_tokens에 토큰 저장
    await db.saveAuthToken(accessToken, refreshToken)

    // 토큰을 쿠키로 보내주고 성공메세지 반환
    const cookies: ICookie[] = [
        {
            name: 'accessToken',
            value: accessToken,
            options: {
                httpOnly: true,
                secure: true,
                maxAge: isAutoLogin ? 60 * 60 * 24 * 28 : undefined,
            },
        },
        {
            name: 'refreshToken',
            value: refreshToken,
            options: {
                httpOnly: true,
                secure: true,
                maxAge: isAutoLogin ? 60 * 60 * 24 * 28 : undefined,
            },
        },
    ]

    return cookies
}
