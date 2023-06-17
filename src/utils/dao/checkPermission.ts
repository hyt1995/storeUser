import mysql from '../common/mysql'
import { IPermission, IPermissionParam } from './types'

const checkPermission = async ({
    adminIdx,
    table,
    method,
}: IPermissionParam) => {
    const sql = `SELECT permissions FROM Admin.admins WHERE idx = ?`

    const result = await mysql.read(sql, [adminIdx])

    const permissions = result[0].permissions as IPermission[]
    const permission = permissions.find((p) => p.menu === table)
    const hasPermission = permission?.[method] ?? false

    return hasPermission
}

export default checkPermission
