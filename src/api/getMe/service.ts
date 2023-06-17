import { _genServiceResult } from '../../utils/common/result'
import { IReq } from './type'

const service = async (req: IReq) => {
    const { payload, renewalToken } = req

    return _genServiceResult({
        statusCode: 200,
        data: {
            userIdx: payload.userIdx,
            email: payload.email,
            isAdmin: payload.isAdmin,
        },
        renewalToken,
    })
}

export default service
