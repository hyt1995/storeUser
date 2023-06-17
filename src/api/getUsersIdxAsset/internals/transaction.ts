import axios from 'axios'

const TRANSACTION_INTERNAL_API_URL = process.env.TRANSACTION_INTERNAL_API_URL

export interface IRewardStatistics {
    /** 상품 idx */
    product_idx: number
    /** 리워드 수익 */
    reward_income: number
}

/**
 * 리워드 통계
 * @param _userIdx
 * @returns
 */
export const _getUserRewardStatistics = async (_userIdx: number) => {
    let tempRewardStatistics = null
    try {
        // 리워드 기능 추가되면 수정 필요
        const { data } = await axios.get(
            `${TRANSACTION_INTERNAL_API_URL}/users/${_userIdx}/reward-statistics`,
        )
        tempRewardStatistics = data as IRewardStatistics[]
    } catch (e) {
        throw e
    }

    const rewardStatisticsTable: { [key: string]: number } = {}
    tempRewardStatistics.forEach((stat) => {
        rewardStatisticsTable[stat.product_idx] = stat.reward_income
    })

    // 리워드 총 수익
    const totalRewardIncome = tempRewardStatistics.reduce((acc, stat) => {
        return acc + stat.reward_income
    }, 0)

    return { rewardStatisticsTable, totalRewardIncome }
}

/**
 * 빈 리워드 통계
 * @todo 리워드 기능 추가되면 삭제 필요
 * @todo 리워드 기능 추가되면 _getUserRewardStatistics로 대체
 */
export const _getBlankUserRewardStatistics = async (_userIdx: number) => {
    return {
        rewardStatisticsTable: {} as { [key: string]: any },
        totalRewardIncome: 0,
    }
}
