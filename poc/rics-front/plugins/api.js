export default defineNuxtPlugin((nuxtApp) => {
//    const baseURL = 'http://localhost:8080/jikajimai'
    const baseURL = '/jikajimai'
    const api = $fetch.create({
        baseURL,
        async onRequest({ request, options }) {
            // リクエスト前の共通処理
            console.log('Request:', request);
            // debugger
            // 例: 認証トークンをヘッダーに追加
            options.headers = options.headers || {};
            const token = window?.localStorage?.getItem('token');
            options.headers = new Headers(options.headers);
            options.headers.set("current-Path", nuxtApp.runWithContext(() => useRoute().path));
            if (!token) {
                console.warn('Token not found. Please login first.');
            }/* else if(request.indexOf('/auth/login') !== -1){
                console.warn('Token is time out! . Please login first.');
            }*/else {
                // debugger
                options.headers.set("Authorization", `Bearer ${token}`);
                // const currentPath = useRoute().path;

            }
            if (!(options.body instanceof FormData)) {
                options.headers.set("Content-Type", "application/json");
            }
        },
        async onRequestError({ request, options, error }) {
            // リクエストエラー時の共通処理
            console.error('Request Error:', error);
        },
        async onResponse({ request, options, response }) {
            console.log('Response:', response);
            // 🔁 檢查是否有刷新 token
            const newToken = response.headers.get('X-Refreshed-Token');
            if (newToken) {
              console.info('🔄 Token refreshed:', newToken);
              window.localStorage.setItem('token', newToken);
            }
        },  
        async onResponseError({ request, options, error, response }) {
            // レスポンスエラー時の共通処理
            console.error('Response Error:', response);
            const statusCode = response.status;

            // 出现访问权限问题
            // debugger
            if (statusCode === 403 || statusCode === 401) {

                // 登录窗口， 直接显示错误
                if (request.indexOf('/auth/login') !== -1) {
                    return Promise.reject({
                        message: 'ログインに失敗しました。'
                    });
                }

                //  其他界面， 跳转登录界面
                window.localStorage.removeItem('isSigninFlg');
                window.localStorage.removeItem('token');
                await nuxtApp.runWithContext(() => navigateTo('/login'));
//                navigateTo('/login');
            }
            else {
                // 网络异常， 不再跳转500
                if(response._data.error === "Internal Server Error"){
                    return Promise.reject({
                        message: response._data.path + 'Internal Server Error'
                    });
                } else {
                    await nuxtApp.runWithContext(() => navigateTo('/500')); 
                }
            }
            // エラーレスポンスのJSONを返す
            const errorData = await response.json();
            return Promise.reject(errorData);
        },
    });

    // useNuxtApp().$api で使用可能にする
    return {
        provide: {
            api,
            apiBaseURL: baseURL
        },
    };
});
