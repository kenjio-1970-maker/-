// export default defineNuxtRouteMiddleware((to) => {
//     // 暂时跳过登录验证
//     console.log('登录验证已暂时禁用');
//
//     // 原始登录验证逻辑（已注释）
//     /*
//     if(!window?.location) {
//         console.log('You are not in the browser!');
//         return
//     }
//     const isSigned = JSON.parse(window.sessionStorage.getItem('isSigninFlg') || 'false');
//     if(!isSigned && to.path !== '/login') {
//       console.log('You are not signed in!');
//       return navigateTo('/login');
//     }
//     */
//     return;
// });




export default defineNuxtRouteMiddleware((to) => {

    if(!window?.location) {
        console.log('You are not in the browser!');
        return
    }
    const isSigned = JSON.parse(window.localStorage.getItem('isSigninFlg') || 'false');
//     debugger
    if(!isSigned && to.path !== '/login') {
      console.log('You are not signed in!');
      return navigateTo('/login');
    }else {
        return true;
    }

});