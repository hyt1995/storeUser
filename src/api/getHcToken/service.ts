import { _genServiceResult } from '../../utils/common/result'
import db from './dao'
import { IReq } from './type'
import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'

const service = async (req: IReq) => {
    const { payload, renewalToken } = req

    const { email, name } = await db.selectUser(payload.userIdx)

    // ? 이 secret 키는 실제로는 환경 변수로 저장해야 합니다.
    const ZENDESK_KEY = '3SU4jmIsYNAc5DK3wz2wG6QVpTi7xXycPJKPUIsB0MbSX0Kv'

    const jwtPayload = {
        email,
        name: name ?? email,
        jti: uuid(),
        iat: Math.floor(new Date().getTime() / 1000),
    }

    const helpCenterToken = jwt.sign(jwtPayload, ZENDESK_KEY)

    return _genServiceResult({
        statusCode: 200,
        data: {
            helpCenterToken,
        },
        renewalToken,
    })
}

export default service
