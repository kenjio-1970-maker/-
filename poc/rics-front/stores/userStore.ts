import { ca } from "element-plus/es/locale/index.mjs";
import dictStore from "@/stores/dictStore";
// import { useAuthStore } from '@/stores/auth';
//
// const authStore = useAuthStore();
import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
    state: () => ({
        isSigninFlg: false,
        username: '',
        password: '',
        role: '',
        errorMsg: ''
    }),
    actions: {
        setLoginInfo(username: string, password: string) {
            this.username = username;
            this.password = password;
        },
        clearSigninState() {
            this.isSigninFlg = false;
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('loginUsername');
            window.localStorage.setItem('isSigninFlg', JSON.stringify(this.isSigninFlg));
        },
        async signIn(onSuccess?: (res: any) => void, onError?: (err: any) => void): Promise<any> {
            this.clearSigninState();

            const { $api } = useNuxtApp();
            try {
                const response: any = await $api('/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: this.username, password: this.password })
                });

                if (response.token) {
                    this.isSigninFlg = true;
                    this.errorMsg = '';
                    window.localStorage.setItem('isSigninFlg', JSON.stringify(this.isSigninFlg));
                    window.localStorage.setItem('token', response.token);
                    window.localStorage.setItem('loginUsername', this.username);

                    await fetchAllDicts();
                    await flushMenu();
                    if (onSuccess) onSuccess(response); // ✅ 呼叫 callback
                } else {
                    this.isSigninFlg = false;
                    window.localStorage.setItem('isSigninFlg', JSON.stringify(this.isSigninFlg));
                    if (onError) onError(response);
                }
            } catch (error: any) {
                this.isSigninFlg = false;
                if (error.response?.status === 401) {
                    this.errorMsg = '用户名或密码错误';
                } else if (error.response?.status === 500) {
                    this.errorMsg = '服务器错误，请稍后重试';
                } else {
                    this.errorMsg = error.message || '登录失败，请检查网络';
                }
                window.localStorage.setItem('isSigninFlg', JSON.stringify(this.isSigninFlg));
                if (onError) onError(this.errorMsg); // ❌ 失敗 callback
                return null;
            }
        },
        async signOut(): Promise<any> {
            const { $api } = useNuxtApp();
            const token = window.localStorage.getItem('token');
            console.log('📢 開始登出流程，token:', token);

            try {
                const res = await $api('/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                this.clearSigninState();
                navigateTo('/login');
                return res; // ✅ 強制回傳
            } catch (error) {
                console.error('Logout Error occurred:', error);
                throw error;
            }
        }
    }
});

// 处理字典数据 
async function fetchAllDicts() {
    try {
        // const response = await fetch("/sys/code/mapping/all");
        const response = await useNuxtApp().$api("/sys/code/mapping/all");
        const allData = await response.data;
        dictStore.setAllDict(allData);
        console.log("すべての辞書データがキャッシュにロードされました。");
    } catch (error) {
        console.error("すべての辞書データの取得に失敗しました：", error);
    }
}

// 清理菜单缓存     
async function flushMenu() {
    try {
        window.localStorage.removeItem("sysAppAllMenu");
    } catch (error) {
        console.error("メニューキャッシュのクリアに失敗しました：", error);
    }
}