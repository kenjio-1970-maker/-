// plugins/permission.ts
import { usePermissionStore } from '@/stores/permission'
import { sysAppMenu } from '@/stores/sysAppMenu';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('perm', {
        async mounted(el, binding) {
            const requiredPerm = binding.value; // 例如 'W'
            const currentPath = useRoute().path;
            const store = usePermissionStore();
            const sysAppStore = sysAppMenu();

            try {
                // debugger
                const userPerm = await sysAppStore.querySysMenuPerm(currentPath);
                // 获取当前路径的权限标识
                const currentPathPermission = userPerm?.[currentPath];
                
                // 权限等级常量定义
                const PERMISSION_LEVEL = { R: 1, W: 2, X: 3 };

                // 比较用户权限与所需权限
                if ((PERMISSION_LEVEL[currentPathPermission] || 0) < (PERMISSION_LEVEL[requiredPerm] || 0)) {
                    el.parentNode && el.parentNode.removeChild(el);
                }
            } catch (error) {
                console.error('Failed to get permission:', error);
                // 如果获取权限失败，为安全起见移除元素
                el.parentNode && el.parentNode.removeChild(el);
            }
        },
    });
});