import { AuthMethodType } from '../../../constants/enums'

export interface IPostVerifySnsParams {
    platform: AuthMethodType
    tokenId: string
    state?: string
}
