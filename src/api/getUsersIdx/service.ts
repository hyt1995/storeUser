import { E12000, E20024, _createError } from '../../configs/error'
import checkPermission from '../../utils/checkPermission'
import {
    methodTypes,
    permissionTables,
} from '../../utils/checkPermission/types'
import { _genServiceResult } from '../../utils/common/result'
import db from './dao'
import { IReq } from './types'

const service = async (req: IReq) => {
    const {
        params: { idx },
        payload: { userIdx, isAdmin },
        renewalToken,
    } = req

    // 타 유저의 정보를 조회할 경우 에러를 반환합니다.
    const isAdminHasPermission =
        isAdmin &&
        (await checkPermission({
            adminIdx: userIdx,
            table: permissionTables.users,
            method: methodTypes.read,
        }))

    if (!isAdminHasPermission && userIdx !== Number(idx)) {
        throw _createError(E12000)
    }

    // 유저 정보 조회
    const userData = await db.selectUser(idx)
    if (!Boolean(userData)) {
        throw _createError(E20024)
    }

    // let name = userData.name ?? null
    // let email = userData.email ?? null
    // let phone = userData.phone ?? null

    // // 마스킹 처리
    // if (name !== null) {
    //     const nameMaskCount = name.length - 2 < 0 ? 0 : name.length - 2
    //     name = name.slice(0, 1) + '*'.repeat(nameMaskCount) + name.slice(-1)
    // }
    // if (email !== null) {
    //     const splittedEmail = email.split('@')
    //     const emailMaskCount =
    //         splittedEmail[0].length - 2 < 0 ? 0 : splittedEmail[0].length - 2
    //     email =
    //         splittedEmail[0].slice(0, 2) +
    //         '*'.repeat(emailMaskCount) +
    //         '@' +
    //         splittedEmail[1]
    // }
    // if (phone !== null) {
    //     const splittedPhone = [
    //         phone.slice(0, 3),
    //         phone.slice(3, -6),
    //         phone.slice(-4, -2),
    //     ]
    //     splittedPhone[1] += '*'.repeat(2)
    //     splittedPhone[2] += '*'.repeat(2)
    //     phone = splittedPhone.join('-')
    // }

    return _genServiceResult({
        statusCode: 200,
        data: {
            ...userData,
        },
        renewalToken,
    })
}

export default service
