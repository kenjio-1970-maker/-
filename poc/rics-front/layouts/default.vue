<template>
  <div class="common-layout">
    <el-container>
      <!-- 解决login后eltable奔溃的问题（治标不治本） -->
      <el-table style="display: none;"></el-table>
      <!-- 顶栏 -->
      <el-header><testHeader /></el-header>
      <el-container>

        <!-- 导航栏 -->
        <el-aside><test3Menu /></el-aside>
        <!-- Body体 -->
        <el-container class="mainBody">

          <el-main> <NuxtPage /> </el-main>

          <!-- Footer底部 -->
          <el-footer>
            <div class="footer-content">© RICS,inc. All Rights Reserved</div>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
/* 设置全局 */
.common-layout {
  background-color: #f5f5f5;/*  设置背景色 */
  /* background-color: #1900a5; /* 设置背景色 */
   min-height: 50vh; /*确保背景覆盖整个视口高度 */
   display: flex; /* 使用 Flex 布局 */
  flex-direction: column; /* 垂直排列子元素 */
  overflow: hidden; /* 隐藏超出部分 */
}

/* 移除浏览器默认的边距和内边距 */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
} 

/* 顶栏 */
.el-header {
  /* 设置顶栏的高度 */
  height: 50px; 
  /* background-color: #000000; */
  width: 100%; /* 设置宽度 */
  /* box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); */
}

/* Body体 */
.mainBody {
 /* Body体的高度 */
  height: calc(100vh - 66px); /* 减去顶部栏的高度（假设顶部栏高度为 50px） */
}

.el-main {
  display: flex;
  flex-direction: column;
  padding: 1px 10px 0px; /* 设置主内容区域的内边距 */
}

/* 导航栏 */
.el-aside {
  width:auto;
  border-radius: 4px; /* 设置导航栏的圆角弧度 */
  /* background-color: #808080; 设置底部背景色为灰色 */
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);  */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  /* padding-top: 20px; */
  /* color: #ffffff; */

}

/* 底部 */
.el-footer {
  background-color: #ffffff; /* 设置底部背景色为灰色 */
  color: #606266; /* 设置文字颜色 */
  width: 98.5%; /* 设置宽度 */
  /* margin: 10px auto; 居中展示 */
  margin: 10px 10px 1px 10px; /* 居中展示 */
  border-radius: 4px; /* 设置导航栏的圆角弧度 */
  display: flex; /* 使用 Flex 布局 */
  justify-content: flex-end; /* 水平靠右 */
  align-items: center; /* 垂直居中 */
  height: 30px; /* 确保有固定高度 */
  padding-right: 50px; /* 设置右边间隔 */
  overflow: hidden; /* 隐藏超出部分 */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.footer-content {
  text-align: right; /* 确保文字靠右 */
  color: #303133; /* 设置文字颜色为浅灰色 */
  font-size: 11px; /* 调整文字大小为更小 */
  /* font-style: italic; 添加斜体效果 */
  margin-right: 10px; /* 增加右侧间距 */
}
</style>