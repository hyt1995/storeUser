import axios from 'axios'
import { _createQuerystring } from '../common/etc'
import { IPermission, IPermissionParam } from './types'

const checkPermission = async ({
    adminIdx,
    table,
    method,
}: IPermissionParam) => {
    const querystring = _createQuerystring({ idx: adminIdx })
    const url = `${process.env.ADMIN_INTERNAL_API_URL}/permissions?${querystring}`
    const result = await axios.get(url)
    const permissions = result.data.items as IPermission[]
    const permission = permissions.find((p) => p.menu === table)
    const hasPermission = permission?.[method] ?? false

    return hasPermission
}

export default checkPermission
