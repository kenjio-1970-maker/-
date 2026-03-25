<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

onMounted(() => {
  window.addEventListener('logout', () => {
    // 清掉登入資訊
    localStorage.removeItem('token')
    localStorage.removeItem('isSigninFlg')

    // 顯示提示訊息
    ElMessage({
      message: 'セッションの有効期限が切れました。再度ログインしてください。',
      type: 'warning',
      duration: 3000,
    })

    // 跳轉登入頁
    router.push('/login')
  })
})
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
