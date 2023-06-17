import type { APIGatewayEvent, Context } from 'aws-lambda'
import { _genResponse } from '../../utils/common/result'

export const handler = async (event: APIGatewayEvent, _context: Context) => {
    console.info('🚀 ~ event', event)
    const response = _genResponse(
        {
            statusCode: 200,
            data: {
                count: 1592,
                items: [
                    {
                        idx: 1,
                        type: '회원가입',
                        createdAt: 1669709374371,
                        note: '회원가입을 하였습니다.',
                    },
                    {
                        idx: 2,
                        type: '로그인',
                        createdAt: 1669834362957,
                        note: '로그인을 하였습니다.',
                    },
                ],
            },
        },
        event,
    )

    return response
}
