import axios from 'axios'
import querystring from 'node:querystring'
import { E00000, E10000, _createError } from '../../../configs/error'
import { kakao } from '../../../configs/sns'

export const _requestKakaoAccountInfo = async (tokenId: string) => {
    // 토큰 가져오기
    const KAKAO_BASE_URL = 'https://kauth.kakao.com'
    let kakaoAccessResponse
    try {
        kakaoAccessResponse = await axios.post(
            `${KAKAO_BASE_URL}/oauth/token`,
            querystring.stringify({
                grant_type: 'authorization_code',
                client_id: kakao.clientId,
                redirect_uri: kakao.redirectUri,
                code: tokenId,
                client_secret: kakao.clientSecret,
            }),
        )
    } catch (e: any) {
        const response = e.response
        if (typeof response !== 'object') {
            throw e
        }

        const { data } = response
        if (typeof data !== 'object') {
            throw e
        }

        const kakaoAccessErrorDescription = data.error_description
        if (typeof kakaoAccessErrorDescription !== 'string') {
            throw e
        }

        if (
            kakaoAccessErrorDescription.startsWith(
                'authorization code not found for code',
            )
        ) {
            throw _createError(E10000)
        }

        const kakaoAccessErrorTable: { [key: string]: any } = {
            'Bad client credentials': E00000,
            'Redirect URI mismatch.': E00000,
        }

        const isUndefinedError = !Object.keys(kakaoAccessErrorTable).includes(
            kakaoAccessErrorDescription,
        )
        console.error(
            `카카오 액세스 요청 중 오류: ${kakaoAccessErrorDescription}`,
        )
        console.error(
            '등록되지 않은 redirect uri입니다. 카카오 개발자 계정을 확인해주세요.',
        )
        if (isUndefinedError) {
            throw _createError(E00000)
        }

        throw _createError(kakaoAccessErrorTable[kakaoAccessErrorDescription])
    }
    if (typeof kakaoAccessResponse === 'undefined') {
        console.error('카카오 액세스 요청 응답 오류')
        throw _createError(E00000)
    }

    // 카카오톡 사용자 정보 가져오기
    const KAKAO_API_BASE_URL = 'https://kapi.kakao.com'
    const kakaoResponse = await axios.get(`${KAKAO_API_BASE_URL}/v2/user/me`, {
        headers: {
            Authorization: `${kakaoAccessResponse.data.token_type} ${kakaoAccessResponse.data.access_token}`,
        },
    })

    const kakaoAccountInfo = kakaoResponse.data.kakao_account

    if (typeof kakaoAccountInfo !== 'object') {
        console.error('카카오 응답값이 유효하지 않습니다.')
        console.error(kakaoResponse.data)
        throw _createError(E10000)
    }

    const email = kakaoAccountInfo.email
    if (typeof email !== 'string') {
        console.error('카카오 응답값이 유효하지 않습니다.')
        console.error(kakaoResponse)
        throw _createError(E10000)
    }

    return { email }
}
