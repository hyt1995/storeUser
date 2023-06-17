import { AuthMethodType } from '../../constants/enums'
import { IBaseReq } from '../../types'

export interface IParams {
    email?: string
    password?: string
    authMethod: AuthMethodType
    isAutoLogin: boolean
}

export type IReq = IBaseReq<IParams>
