<template>
  <div class="mb-4">
    <el-button>白色</el-button>
    <el-button type="primary" :icon="Edit">蓝色</el-button>
    <el-button type="success">橘黄色</el-button>
    <el-button type="info">灰色</el-button>
    <el-button type="warning">橘黄色2</el-button>
    <el-button type="danger" :icon="Delete">红色</el-button>
    <el-button type="danger" :icon="Delete" :loading="loadingFlag">红色</el-button>
    <el-button type="danger" :icon="Delete" @click="loadingFun">取消加载</el-button>
  </div>
  <div class="table-container">
    <el-table
      :data="tableData"
      border
      stripe
      height="400"
      fit
      style="width: 100%; table-layout: fixed;" <!-- 强制表格使用固定布局 -->
      @current-change="handleCurrentChange"
    >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="customerName" label="名字" min-width="120" max-width="200" show-overflow-tooltip />
      <el-table-column prop="phoneNumber" label="日期" min-width="120" max-width="300" show-overflow-tooltip />
      <el-table-column prop="phoneNumber" label="日期88888888888" min-width="300" show-overflow-tooltip />
      <el-table-column prop="phoneNumber" label="日期88888888888" min-width="300" show-overflow-tooltip />
      <el-table-column prop="phoneNumber" label="日期88888888888" min-width="300" show-overflow-tooltip />
      <el-table-column prop="phoneNumber" label="日期88888888888" min-width="300" show-overflow-tooltip />
      <el-table-column prop="phoneNumber" label="日期88888888888" min-width="300" show-overflow-tooltip />
      <el-table-column prop="phoneNumber" label="日期88888888888" min-width="300" show-overflow-tooltip />
      <el-table-column prop="phoneNumber" label="日期88888888888" min-width="300" show-overflow-tooltip />
      <el-table-column prop="phoneNumber" label="日期88888888888" min-width="300" show-overflow-tooltip />
      <el-table-column prop="phoneNumber" label="日期88888888888" min-width="300" show-overflow-tooltip />
      <el-table-column prop="phoneNumber" label="日期88888888888" min-width="120" show-overflow-tooltip />
      <el-table-column prop="phoneNumber" label="日期88888888888" min-width="120" show-overflow-tooltip />
      <el-table-column prop="phoneNumber" label="日期88888888888" min-width="120" show-overflow-tooltip />
      <el-table-column prop="column" label="颜色" min-width="100" show-overflow-tooltip />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElTable, ElLoading } from 'element-plus';
import { ref, reactive, onMounted } from 'vue';
// import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
// import * as Icons from "@element-plus/icons-vue"; // 引入 Element Plus 图标
import  {ArrowLeft,ArrowRight, Delete, Edit, Share,} from "@element-plus/icons-vue"; // 引入 Element Plus 图标

// 定义表格数据的类型
interface tableData {
  date: string;
  name: string;
  address: string;
}

// 表格数据
const tableData: tableData[] = ref([]);

// 当前选中行
const currentRow = ref();
const loadingFlag = ref(true);
const singleTableRef = ref<InstanceType<typeof ElTable>>();

// 设置当前选中行
const setCurrent = (row?: tableData) => {
  singleTableRef.value!.setCurrentRow(row);
}

// 处理选中行变化
const handleCurrentChange = (val: tableData | undefined) => {
  currentRow.value = val;
  console.log(val); // 打印当前选中的行
  console.log(val?.name); // 打印当前选中的行的名字
}

// 获取数据并显示加载动画
const handleSearch = async () => {
  const loading = ElLoading.service({
    target: '.el-table'  // 将加载动画显示在表格上方
  });

  try {
    const tableResponse = await useNuxtApp().$api("/cusBase/page", {
      method: 'POST',
      body: {
        // page: currentPage.value,
        // pageSize: pageSize.value
      }
    });

    tableData.value = tableResponse.records; // 更新响应式数据
  } catch (error) {
    ElMessage({type: 'error', message: 'データの取得に失敗しました。', style: 'z-index: 3000;'});
  } finally {
    loading.close(); // 无论成功与否都关闭加载动画
  }
};

// 组件挂载时调用 handleSearch 获取初始数据
onMounted(() => {
  handleSearch();
});

// 实现 loadingFun 方法
const loadingFun = () => {
  loadingFlag.value=false;
};
</script>

<style scoped>
.el-table {
  margin-top: 10px;
}

.table-container {
  overflow-x: auto; /* 添加水平滚动条 */
  width: 100%; /* 容器宽度为100% */
}

.el-table th {
  white-space: nowrap; /* 防止表头换行 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  overflow: hidden; /* 隐藏超出部分 */
}

.el-table td {
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  overflow: hidden; /* 隐藏超出部分 */
  white-space: nowrap; /* 防止内容换行 */
}
</style>