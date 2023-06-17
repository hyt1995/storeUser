import axios from 'axios'

const PRODUCT_INTERNAL_API_URL = process.env.PRODUCT_INTERNAL_API_URL

export interface IInvestment {
    /** 상품 idx */
    idx: number
    /** 상품 이름 */
    name: string
    /** 상품 종류 */
    price: number
    /** 보유 상품 수량 */
    amount: number
    /** 투자 금액 */
    investment_amount: number
    /** 투자 비율 */
    investment_ratio: number
}

export const _getUserInvestments = async (userIdx: number) => {
    try {
        const {
            data: { investments },
        } = await axios.get(
            `${PRODUCT_INTERNAL_API_URL}/users/${userIdx}/investments`,
        )
        return investments as IInvestment[]
    } catch (e) {
        throw e
    }
}
