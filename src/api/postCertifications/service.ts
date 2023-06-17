import { E20004, _createError } from '../../configs/error'
import { _genServiceResult } from '../../utils/common/result'
import db from './dao'
import imp from './modules/iamport'
import { IReq } from './types'

const service = async (req: IReq) => {
    const {
        params: { imp_uid: impUid, user_idx: userIdx },
        renewalToken,
    } = req

    // 인증 토큰 발급 받기
    const accessToken = await imp.getAccessToken()

    // imp_uid로 인증 정보 조회
    const certificationsInfo = await imp.getCertifications(impUid, accessToken)

    // 해당 번호로 기인증된 사용자가 있는 지 확인
    const isRegistered = await db.checkIsRegistered({
        phone: certificationsInfo.phone,
    })
    if (isRegistered === true) {
        throw _createError(E20004)
    }

    // 인증 정보를 DB에 저장
    await db.updateProfile(userIdx, certificationsInfo)

    // 사용자 상태를 변경
    await db.updateUserState(userIdx)

    // 인증 상태를 변경
    await db.updateAuthState(userIdx)

    return _genServiceResult({
        statusCode: 200,
        data: {
            status: 'success',
        },
        renewalToken,
    })
}

export default service
