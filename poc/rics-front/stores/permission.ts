// stores/permission.ts
import { defineStore } from 'pinia'

export const usePermissionStore = defineStore('permission', {
    state: () => ({
        // 例如：{ '/user/list': 'W', '/system/menu': 'R' }
        permissionMap: {} as Record<string, 'R' | 'W' | 'X'>,
    }),

    actions: {
        setPermissions(map: Record<string, 'R' | 'W' | 'X'>) {
            this.permissionMap = map
        },
        getPermissionByPath(path: string): 'R' | 'W' | 'X' | '' {
            return this.permissionMap[path] || ''
        },
    },
})