import mailgun from 'mailgun-js'
import { E00000, _createError } from '../../configs/error'
import mailgunConfig from '../../configs/mailgun'

interface IEmailFormat {
    subject: string
    html: string
}

type ITemplateType = 'default'

export const _getSetTemplate = (templateType: ITemplateType, params: any[]) => {
    const { template: templateConfig } = mailgunConfig
    const template = templateConfig[templateType]
    if (template === undefined) {
        console.error('정해진 파라미터 타입이 아닙니다')
        throw _createError(E00000)
    }

    let html = template.html
    let subject = template.subject
    for (const param of params) {
        // 개수가 안맞는 오류 처리가 필요합니다.
        subject = subject.replace('PARAMETER', param)
        html = html.replace('PARAMETER', param)
    }

    return { subject, html }
}

const sendEmail = async (data: mailgun.messages.SendData) => {
    const { apiKey, domain } = mailgunConfig
    if (apiKey === undefined || domain === undefined) {
        console.error('mailgun 구성값이 설정되지 않았습니다.')
        throw _createError(E00000)
    }

    const mg = mailgun({
        apiKey,
        domain,
    })

    try {
        const sendResponse: mailgun.messages.SendResponse = await new Promise(
            (resolve, reject) => {
                mg.messages().send(data, (error: any, body: any) => {
                    if (Boolean(error)) {
                        reject(error)
                    } else {
                        resolve(body)
                    }
                })
            },
        )
        return sendResponse
    } catch (e) {
        console.error(`이메일 발송중 오류가 발생하였습니다. 오류문: ${e}`)
        throw _createError(E00000)
    }
}

/**
 * 유저에게 이메일 전송 함수
 * @param {string} email  유저 이메일
 * @param {number} format 이메일 포맷
 */
export const _sendFormatEmail = async (email: string, format: IEmailFormat) => {
    const { from } = mailgunConfig
    const { subject, html } = format

    // 인증 메일 보내기
    await sendEmail({
        from,
        to: email,
        subject,
        html,
    })
}

// 임시 비밀번호 전송
// if (num === 1) {
//     crypto.createHash('sha512')
//     const now = new Date()
//     const token = email + date.format(now, 'YYYY/MM/DD HH:mm:ss')
//     const sendChangePassword = crypto
//         .createHash('sha512')
//         .update(token)
//         .digest('hex')
//         .slice(0, 11)

//     data = {
//         from: 'hanyt1995 <hanyt1995@ifgroup.io>',
//         to: email,
//         subject: '임시 비밀번호 발송',
//         html: `<div>임시 비밀번호입니다 ${sendChangePassword}</div>`,
//     }
// }
