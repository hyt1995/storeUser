import axios from 'axios'
import impConfig from '../configs/iamport'

const getAccessToken = async () => {
    try {
        const getToken = await axios.post(
            `${impConfig.url}/users/getToken`,
            {
                imp_key: impConfig.apiKey,
                imp_secret: impConfig.apiSecret,
            },
            {
                headers: { 'Content-Type': 'application/json' },
            },
        )
        const { access_token: accessToken } = getToken.data.response
        return accessToken
    } catch (e) {
        throw e
    }
}

interface ICertificationsInfo {
    birth: number
    birthday: string
    certified: boolean
    certified_at: number
    foreigner: boolean
    foreigner_v2: any
    gender: any
    imp_uid: string
    merchant_uid: string
    name: string
    origin: string
    pg_provider: string
    pg_tid: string
    phone: string
    unique_in_site: any
    unique_key: string
}
const getCertifications = async (
    imp_uid: string,
    accessToken: string,
): Promise<ICertificationsInfo> => {
    try {
        const getCertifications = await axios.get(
            `${impConfig.url}/certifications/${imp_uid}`,
            {
                headers: { Authorization: accessToken }, // 인증 토큰 Authorization header에 추가
            },
        )
        const certificationsInfo = getCertifications.data.response // 조회한 인증 정보
        return certificationsInfo
    } catch (e) {
        throw e
    }
}

const imp = {
    getAccessToken,
    getCertifications,
}

export default imp
