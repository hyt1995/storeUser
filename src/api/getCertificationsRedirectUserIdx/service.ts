import { Stage } from '@ironflag/types'
import { _genServiceResult } from '../../utils/common/result'
import db from './dao'
import imp from './modules/iamport'
import { IReq } from './types'

const serviceUrls: { [stage in Stage]: string } = {
    local: 'https://localhost:3000',
    dev: 'https://dev.app.dev',
    qa: 'https://qa.app.dev',
    hotfix: 'https://hotfix.app.dev',
    prod: 'https://app.io',
}
const serviceUrl = serviceUrls[process.env.APP_ENV as Stage]

const service = async (req: IReq) => {
    const {
        params: { imp_uid: impUid, userIdx, success },
        renewalToken,
    } = req

    if (!success) {
        return _genServiceResult({
            statusCode: 302,
            data: {
                status: 'fail',
            },
            renewalToken,
            headers: {
                Location: `${serviceUrl}/`,
            },
        })
    }

    // 인증 토큰 발급 받기
    const accessToken = await imp.getAccessToken()

    // imp_uid로 인증 정보 조회
    const certificationsInfo = await imp.getCertifications(impUid, accessToken)
    if (certificationsInfo.certified === false) {
        return _genServiceResult({
            statusCode: 302,
            data: {
                status: 'fail',
            },
            renewalToken,
            headers: {
                Location: `${serviceUrl}/`,
            },
        })
    }

    // 해당 번호로 기인증된 사용자가 있는 지 확인
    const isRegistered = await db.checkIsRegistered({
        phone: certificationsInfo.phone,
    })
    if (isRegistered === true) {
        return _genServiceResult({
            statusCode: 302,
            data: {
                status: 'already-registered',
            },
            renewalToken,
            headers: {
                Location: `${serviceUrl}/already-registered`,
            },
        })
    }

    // 인증 정보를 DB에 저장
    await db.updateProfile(userIdx, certificationsInfo)

    // 사용자 상태를 변경
    await db.updateUserState(userIdx)

    // 인증 상태를 변경
    await db.updateAuthState(userIdx)

    return _genServiceResult({
        statusCode: 302,
        data: {
            status: 'success',
        },
        renewalToken,
        headers: {
            Location: `${serviceUrl}/`,
        },
    })
}

export default service
