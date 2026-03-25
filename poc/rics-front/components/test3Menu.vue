<template>
    <!-- text-color="#444444" -->
  <el-menu
    :default-active="activeMenu"
    class="el-menu-vertical-demo"
    @select="handleSelect"
    :collapse="isCollapse"
    unique-opened
    font-color="#d3f7ff"
  >
    <el-sub-menu
      v-for="item in menuList"
      :key="item.id"
      :index="String(item.id)"
      class="menuHeadercls"
    >
      <template #title>
        <el-icon>
          <!-- 图表处理逻辑: 优先展示引入自定义 SVG 图标, 若不存在则获取elementUI图标(应该更换字段获取, 当前只能获取到默认图标) -->
          <img   v-if="item.icon" :src="`/icons/${item.icon}.svg`"   alt="icon"  class="custom-icon"  />
          <component  v-else :is="getIconComponent(item.icon)" />
        </el-icon>
        <span >{{ item.appName }}</span>
      </template>
      <el-menu-item-group class="menuItemsGroupCls">
        <el-menu-item
          v-for="child in item.children"
          :key="child.id"
          :index="child.id"
          @click="navigateTo(child.appUrl)"
          class="menuItemsCls"
          style="height: 38px;"
        >
          {{ child.appName }}
        </el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
  </el-menu>
</template>

<script lang="ts" setup>
import { useAsyncData } from "#app";
import * as Icons from "@element-plus/icons-vue"; // 引入 Element Plus 图标
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { sysAppMenu } from '@/stores/sysAppMenu';

const sysAppStore = sysAppMenu();
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

// 1. 获取菜单
let menuList = await sysAppStore.querySysMenu();

// 2. 选中菜单
const activeMenu = ref("1");
const handleSelect = (index) => {
  activeMenu.value = index;
  // navigateTo(menuList.find(item => item.id === parseInt(index))?.appUrl || '/');
};

// Simulate menu click on load
onMounted(() => {
  handleSelect("2345234423"); // Replace "1" with the desired menu index
});

// 3. 解析图标
const getIconComponent = (iconName) => Icons[iconName] || Icons.Menu;

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const router = useRouter();

const navigateTo = (path) => {
  router.push(path);
};

const isCollapse = ref(false);

const ifShowMenu = () => {
  isCollapse.value = !isCollapse.value;
};
</script>

<style scoped>
/* .el-menu-vertical-demo:not(.el-menu--collapse) { */

/* 菜单后的样式 */
.el-menu-vertical-demo{
  /* width: 200px; */
  /* height: 888px; */
  /* max-height: 700px; */
  height: calc(100vh - 66px); /* 减去顶部栏的高度（假设顶部栏高度为 50px） */
  overflow-y: auto; /* 如果内容超出，允许滚动 */  
  border-right: 4px solid #c3e5f8; /* 添加红色右边框 */
  background-color: #d3f7ff;/* true */
}

/* 菜单项悬停时的背景颜色 */
.el-menu-vertical-demo .el-menu-item:hover {
  background-color:  #b9d5e3; /* 设置悬停时的背景颜色 */
  color: #0f0462;
}

/* 子菜单标题悬停时的背景颜色 */
/* .el-menu-vertical-demo .el-sub-menu:hover > .el-sub-menu__title {
  background-color: #b9d5e3;
  color: #0f0462;
} */

.menuHeaderCls {
  font-weight: bold;
  font-size: 14px;
  /* color: #0078D7; */
}

/* 菜单项组的样式 */
::v-deep(.el-menu-item-group__title) {
  padding: 0px 0px 0px 0px !important;
}

 .menuItemsCls {
  background-color: #bedeee;
}

.custom-icon {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
</style>
