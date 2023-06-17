import type { APIGatewayEvent, Context } from 'aws-lambda'
import { _genResponse } from '../../utils/common/result'

export const handler = async (event: APIGatewayEvent, _context: Context) => {
    console.info('🚀 ~ event', event)
    const response = _genResponse(
        {
            statusCode: 200,
            data: {
                count: 1592,
            },
        },
        event,
    )

    return response
}
