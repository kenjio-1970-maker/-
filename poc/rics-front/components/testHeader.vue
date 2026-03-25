<template>
  <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
  >

    <!-- left - logo -->
    <el-menu-item index="1" class="header-text-cls-elemenu">
      <template #title>
        <img class="header-logo-cls" src="/images/logoMain.png" @click="navigateTo('/')"/>
        <span class="header-text-cls" @click="navigateTo('/')">実家じまい管理システム</span>
      </template>
    </el-menu-item>

    <!-- right - Help -->
    <el-menu-item index="8" style="width: 20px">
      <template #title >
        <img style="width: 30px" src="/images/help.jpg" @click="handleHelpClick"/>
    </template>
    </el-menu-item>

    <!-- userCenter -->
    <el-sub-menu index="2" >
      <template #title >
      <img style="width: 30px; margin-left: -15px;" src="/images/headerLogo.svg" alt="Element logo"/>
    </template>
      <el-menu-item index="2-1" class="user-item-cls">{{ curLogin() }}</el-menu-item>
      <el-menu-item index="2-2" class="user-item-cls">パスワード変更</el-menu-item>
      <el-menu-item index="2-3" class="user-item-cls">ログアウト</el-menu-item>
      <!-- <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one11</el-menu-item>
        <el-menu-item index="2-4-2">item two22</el-menu-item>
        <el-menu-item index="2-4-3">item three33</el-menu-item>
      </el-sub-menu> -->
    </el-sub-menu>
  </el-menu>
  <!-- 查看对话框 -->
  <el-dialog v-model="helpDialogVisible" title="" width="90%" height="90%">
    <helpFrom />
  </el-dialog>
  <!-- pwd change -->
  <el-dialog v-model="pwdChgDialogVisible" title="パスワード変更" width="500px" height="300px">
    <PwdChangeForm ref="pwdFormRef" @close="pwdChgDialogVisible = false" @logout="handleLogout" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { House } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import helpFrom from "~/pages/sys/help.vue";
import PwdChangeForm from '~/pages/sys/PwdChangeForm.vue'
import { watch } from 'vue'
import { useUserStore } from '@/stores/userStore';

// 帮助对话框
const helpDialogVisible = ref(false);
const activeIndex = ref('1')
const router = useRouter();
const pwdChgDialogVisible = ref(false);
const pwdFormRef = ref()
const userStore = useUserStore();

// 菜单点击事件
const handleSelect = (key: string, keyPath: string[]) => {
  switch (key) {
    case '2-2':
      handlePwdChg();
      break;
    case '2-3':
      handleLogout(); // 登出
      break;
  }
};

// 跳转到指定页面
const navigateTo = (path) => {
  router.push(path);
};

// 获取当前登录用户
const curLogin = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem('loginUsername') || '匿名ユーザー';
  }
  return '匿名ユーザー';
};

// 打开Help对话框
const handleHelpClick = () => {
  helpDialogVisible.value = true;
};

// 关闭Help对话框
const handleCloseEditDialog = () => {
  helpDialogVisible.value = false;
};

const handleLogout = async () => {
    userStore.signOut();
};

const handlePwdChg = () => {
  pwdChgDialogVisible.value = !pwdChgDialogVisible.value;
}

watch(pwdChgDialogVisible, (visible) => {
  if (visible) {
    pwdFormRef.value?.resetForm?.()
  }
})
</script>

<style scoped>
.header-logo-cls {
  width: 30px;
  /* height: 30px; */
  margin-right: 15px;
}
.header-text-cls {
  font-size: 26px; /* 增大字体 */
  font-weight: bold;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* 设置优雅的字体 */
  background: linear-gradient(to right, #4facfe, #00f2fe); /* 渐变文字颜色 */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; /* 文字填充透明以显示渐变 */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); /* 添加阴影效果 */
  margin-left: 10px; /* 调整间距 */
}

.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}
/* html, body {
  margin: 0;
  padding: 0;
  width: 100%;
} */
.el-menu {
  margin: 0;
  padding: 0;
  height: 40px;
  box-sizing: border-box;
  /* background-color: blue; */
  /* width: 101.5%; */
  width: 102.8%;
  margin-left: -2.2%;
  border-radius: 4px; /* 设置导航栏的圆角弧度 */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
/* .user-item-cls {
  height: auto;
  line-height: auto;
  width: 10px;
  padding: 0 20px;
} */
:root {
  --el-menu-active-color: transparent;
}
.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: none !important; 
}

/* 去掉 el-menu-item 鼠标悬停时的背景 */
.header-text-cls-elemenu:hover {
  background-color: transparent !important;
}
</style>