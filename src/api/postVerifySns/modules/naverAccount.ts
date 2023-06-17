import axios from 'axios'
import { E00000, E10000, _createError } from '../../../configs/error'
import { naver } from '../../../configs/sns'

const { clientId: NAVER_CLIENT_ID, clientSecret: NAVER_CLIENT_SECRET } = naver

export const _requestNaverAccountInfo = async (
    tokenId: string,
    state: string,
) => {
    // 네이버 액세스 토큰 요청
    const NAVER_TOKEN_REQUEST_URL =
        'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code'
    const naverAccessTokenResponse = await axios.get(
        `${NAVER_TOKEN_REQUEST_URL}&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&code=${tokenId}&state=${state}`,
    )

    const naverAccessErrorDescription =
        naverAccessTokenResponse.data.error_description
    if (typeof naverAccessErrorDescription === 'string') {
        const naverAccessErrorTable: { [key: string]: any } = {
            'no valid data in session': E10000,
            'wrong client id / client secret pair': E00000,
        }

        const isUndefinedError = !Object.keys(naverAccessErrorTable).includes(
            naverAccessErrorDescription,
        )
        console.error(
            `네이버 액세스 요청 중 오류: ${naverAccessErrorDescription}`,
        )
        if (isUndefinedError) {
            throw _createError(E00000)
        }

        throw _createError(naverAccessErrorTable[naverAccessErrorDescription])
    }

    const naverOAuthAccessToken = naverAccessTokenResponse.data.access_token

    if (typeof naverOAuthAccessToken !== 'string') {
        console.error('네이버 액세스 토큰 응답값이 유효하지 않습니다.')
        throw _createError(E10000)
    }

    // 네이버 계정 요청
    const NAVER_REQUEST_URL = 'https://openapi.naver.com/v1/nid/me'
    const {
        data: { response: naverResponse },
    } = await axios.get(NAVER_REQUEST_URL, {
        headers: {
            Authorization: `Bearer ${naverOAuthAccessToken}`,
        },
    })
    if (typeof naverResponse !== 'object') {
        console.error('네이버 응답값이 유효하지 않습니다.')
        console.error(naverResponse)
        throw _createError(E10000)
    }

    const { email } = naverResponse
    if (typeof email !== 'string') {
        console.error('네이버 응답값이 유효하지 않습니다.')
        console.error(naverResponse)
        throw _createError(E10000)
    }

    return { email }
}
