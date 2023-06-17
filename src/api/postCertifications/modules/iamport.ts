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
    birth: number // 799340400
    birthday: string // '1995-05-02'
    certified: boolean // true
    certified_at: number // 1672974558
    foreigner: boolean // false
    foreigner_v2: any // null
    gender: any // null
    imp_uid: string // 'imp_486527673140'
    merchant_uid: string // '342904a2-38d9-4203-b0fa-f3d89c766fbc'
    name: string // '이정우'
    origin: string // 'https://localhost:3000/signup/email'
    pg_provider: string // inicis_unified'
    pg_tid: string // 'INISA_MIIiasTest202301061209008861375579'
    phone: string // '01095220890'
    unique_in_site: any // null
    unique_key: string // 'B/9zn1tJ8WWxHKUE2QxcI7XfE4yGWNpUFNsJoltRdmnDGCZ48bkQDxyA5Lr/0/OuLq36oRR5p9NpRkBVuY28Ig=='
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
