// store/dictStore.js


import { defineStore } from 'pinia'

export const sysAppMenu = defineStore('sysAppMenu', {
    state: () => ({
        // your state here
    }),
    actions: {
        // your actions here

        async querySysMenu(){
            let menuList = await this.querySysMenuDetail();
            // return menuList.menus;
            // return menuList.menus;
            return menuList?.menus ?? [];

        },

        async querySysMenuPerm(urlKey){
            let menuList = await this.querySysMenuDetail();
            // return menuList;
            // return menuList?.btns ?? [];
// debugger
//             let sss = menuList?.btns?.get(urlKey) ?? '';

            // return menuList?.btns?.get(urlKey) ?? '';
            // console.log('menuList类型:', typeof menuList?.btns);
            // console.log('menuList内容:', menuList?.btns);
            return menuList?.btns ?? '';
        },

        async querySysMenuDetail(){
//             debugger
            let menuList = window?.localStorage?.getItem('sysAppAllMenu');
            if (!menuList || menuList === '') {
                try {
                    menuList = await useNuxtApp().$api("/api/sys/app", {method: 'GET'});
                    window.localStorage.setItem("sysAppAllMenu", JSON.stringify(menuList));
                    // menuList = resMenuData;
                    // menuList = JSON.parse(resMenuData);
                } catch (error) {
                    console.error("メニューデータの取得に失敗しました。", error);
                }
            } else {
                menuList = JSON.parse(menuList);
            }
            return menuList;
        },

    },
})






