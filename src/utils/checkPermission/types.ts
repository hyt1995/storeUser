export interface IPermissionParam {
    adminIdx: number
    table: PermissionTableType
    method: MethodType
}

export const methodTypes = {
    read: 'read',
    write: 'write',
} as const
type MethodType = typeof methodTypes[keyof typeof methodTypes]

export const permissionTables = {
    users: 'users',
    admins: 'admins',
    products: 'products',
    banners: 'banners',
    departments: 'departments',
    dashboard: 'dashboard',
    investments: 'investments',
    deposits: 'deposits',
    favorites: 'favorites',
} as const
type PermissionTableType =
    typeof permissionTables[keyof typeof permissionTables]

export interface IPermission {
    menu: string
    read: boolean
    write: boolean
}
