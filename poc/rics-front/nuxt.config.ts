// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@element-plus/nuxt',
    '@pinia/nuxt',
    '@vee-validate/nuxt'
  ],
  plugins: [
    '~/plugins/element-icons.js',
    '~/plugins/yup-custom-msg.js',
    '~/plugins/api.js'
  ],
  compatibilityDate: '2024-12-28',
  app: {
    head: {
      title: '実家じまい管理システム',
       meta: [
        { name: 'description', content: '実家じまい管理システム' },
        { name: 'robots', content: 'noindex, nofollow' } 
      ]
    }
  },
  // POC: mock-APIへのプロキシ設定
  // /jikajimai/** → http://localhost:8080/jikajimai/**
  nitro: {
    devProxy: {
      '/jikajimai': {
        target: 'http://localhost:8080/jikajimai',
        changeOrigin: true,
        prependPath: false,
      }
    }
  }
})
