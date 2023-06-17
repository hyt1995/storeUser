import { ICookie } from '../../types'
import { _parseCookie } from '../../utils/common/request'
import { _genServiceResult } from '../../utils/common/result'
import db from './dao'
import { IReq } from './types'

const service = async (req: IReq) => {
    const { headers } = req
    const cookie = headers?.Cookie ?? headers?.cookie ?? ''
    const cookieObj = _parseCookie(cookie)
    const { refreshToken } = cookieObj

    const result = await db.deleteAuthToken({ refreshToken })
    const isSuccess = result.affectedRows === 1
    if (result.affectedRows > 1) {
        console.error('1개 이상의 토큰이 삭제되었습니다.')
        console.error(`삭제된 토큰 개수: ${result.affectedRows}`)
    }

    const cookies: ICookie[] = [
        {
            name: 'accessToken',
            value: '',
            options: {
                httpOnly: true,
                secure: true,
                maxAge: 0,
            },
        },
        {
            name: 'refreshToken',
            value: '',
            options: {
                httpOnly: true,
                secure: true,
                maxAge: 0,
            },
        },
    ]

    return _genServiceResult({
        statusCode: 200,
        data: {
            result: isSuccess,
        },
        cookies,
    })
}

export default service
