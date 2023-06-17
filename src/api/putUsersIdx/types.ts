import { IBaseReq } from '../../types'

export interface IParams {
    idx: number
    user_state?:
        | 'deactivated'
        | 'dormancy'
        | 'normal'
        | 'sanction_abnormal_access'
        | 'sanction_abnormal_transaction'
        | 'waiting'
    investor_type?: 'general' | 'professional' | 'qualified'
}

export type IReq = IBaseReq<IParams>
