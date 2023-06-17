import { E10001, _createError } from '../../configs/error'
import { _genServiceResult } from '../../utils/common/result'
import db from './dao'
import { _getUserInvestments } from './internals/product'
import { _getBlankUserRewardStatistics } from './internals/transaction'
import { IReq } from './types'

/**
 * @description 사용자 자산 조회
 */
const service = async (req: IReq) => {
    const { idx } = req.params
    const { userIdx } = req.payload

    if (userIdx !== parseInt(idx, 10)) {
        throw _createError(E10001)
    }

    // 거래 가능 자산 중 현금
    const cash = await db.getCash(userIdx)

    // 투자 통계
    const investmentStats = await _getUserInvestments(userIdx)

    // 누적 리워드 통계, 총 리워드 수익
    const { rewardStatisticsTable, totalRewardIncome } =
        await _getBlankUserRewardStatistics(userIdx)

    // 투자 및 누적 리워드 통계
    const investmentProducts = investmentStats.map((stat) => {
        const rewardIncome = rewardStatisticsTable[stat.idx] ?? 0
        const rewardIncomePercentage =
            (rewardIncome / stat.investment_amount) * 100

        return {
            ...stat,
            reward_income: rewardIncome,
            reward_income_percentage: rewardIncomePercentage,
        }
    })

    // 총 투자 금액 = 회원이 투자한 모든 자산의 매수가
    const totalInvestmentAmount = investmentProducts.reduce((acc, cur) => {
        return acc + cur.investment_amount
    }, 0)

    // 총 자산 = 거래 가능 자산 + 총 투자 금액
    const totalAssetAmount = cash + totalInvestmentAmount

    const investment_products = [
        ...investmentProducts,
        {
            idx: 'cash',
            investment_amount: cash,
            investment_ratio: 0,
            name: '캐시',
        },
    ].map((stat) => {
        stat.investment_ratio = stat.investment_amount / totalAssetAmount
        return stat
    })

    // 리워드 수익률 = 리워드 수익 / 총 투자 금액
    const totalRewardIncomePercentage =
        (totalRewardIncome / totalInvestmentAmount) * 100

    return _genServiceResult({
        statusCode: 200,
        data: {
            cash,
            total_investment_amount: totalInvestmentAmount,
            total_asset_amount: totalAssetAmount,
            total_reward_income: totalRewardIncome,
            total_reward_income_percentage: totalRewardIncomePercentage,
            investment_products,
        },
        renewalToken: req.renewalToken,
    })
}

export default service
