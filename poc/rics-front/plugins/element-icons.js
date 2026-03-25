import { defineNuxtPlugin } from "#app";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export default defineNuxtPlugin((nuxtApp) => {
    for (const [key, value] of Object.entries(ElementPlusIconsVue)) {
        nuxtApp.vueApp.component(key, value)
    }
})