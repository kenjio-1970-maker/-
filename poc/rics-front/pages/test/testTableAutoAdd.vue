<template>
  <div class="mb-4">
    <el-button>白色</el-button>
    <el-button type="primary" :icon="Edit" @click="handleSaveAll">保存</el-button>
    <el-button type="success" @click="handleAddRow">增加一行</el-button>
  </div>
  
  <!-- border 
  stripe  -->
  <el-table 
  :data="tableData" 
  height="auto" 
  highlight-current-row 
  style="width: 100%" 
  @current-change="handleCurrentChange">
    <el-table-column type="index" align="center"></el-table-column>
    <el-table-column v-for="(col, index) in columns" :key="index" :prop="col.prop" :label="col.label" :width="col.width" show-overflow-tooltip>
      <template #default="scope">
        <el-input v-model="scope.row[col.prop]" size="small" class="full-width-input" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { ElMessage, ElTable, ElLoading } from 'element-plus';
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight, Delete, Edit, Share } from "@element-plus/icons-vue";

// 定义表格数据的类型
interface TableData {
  [key: string]: any;
  editing?: boolean;
}

// 表格列配置
const columns = [
  { prop: 'customerName', label: '名字', width: 'auto' },
  { prop: 'phoneNumber', label: '日期', width: 'auto' },
  { prop: 'column', label: '颜色', width: '100' }
];

// 表格数据
const tableData = ref<TableData[]>([]);

// 当前选中行
const loadingFlag = ref(true);

// 添加空行
const handleAddRow = () => {
  const emptyRow = {
    customerName: '',
    phoneNumber: '',
    column: '',
    editing: true
  };
  tableData.value.push(emptyRow);
};

// 开始编辑
const handleStartEdit = (row: TableData) => {
  row.editing = true;
};

// 完成编辑
const handleEdit = (row: TableData) => {
  row.editing = false;
  // 这里可以添加保存数据的逻辑
  ElMessage.success('編集が完了しました。');
};

// 保存所有数据
const handleSaveAll = async () => {
  try {
    // 模拟后台保存请求
    await new Promise(resolve => setTimeout(resolve, 1000));
    ElMessage({type: 'success', message: '保存が完了しました。', style: 'z-index: 3000;'});
  } catch (error) {
    ElMessage({type: 'error', message: '保存に失敗しました', style: 'z-index: 3000;'});
  }
};

// 获取数据并显示加载动画
const handleSearch = async () => {
  const loading = ElLoading.service({
    target: '.el-table'
  });

  try {
    const tableResponse = await useNuxtApp().$api("/cusBase/page", {
      method: 'POST',
      body: {}
    });

    // 如果tableData为空，则初始化数据，否则保持现有数据
    if (tableData.value.length === 0) {
      tableData.value = tableResponse.records.map((record: any) => ({
        ...record,
        editing: false
      }));
    }
  } catch (error) {
    ElMessage({type: 'error', message: 'データの取得に失敗しました。', style: 'z-index: 3000;'});
  } finally {
    loading.close();
  }
};

// 组件挂载时调用 handleSearch 获取初始数据
onMounted(() => {
  handleSearch();
});

// 实现 loadingFun 方法
const loadingFun = () => {
  loadingFlag.value = false;
};

// 处理当前行变化
const handleCurrentChange = (val: TableData | undefined) => {
  console.log('現在選択されている行:', val);
};
</script>

<style scoped>
.el-table {
  margin-top: 10px;
}

.full-width-input {
  width: 100%;
}

.full-width-input :deep(.el-input__wrapper) {
  padding: 0;
  width: 100%;
  height: 100%;
  box-shadow: none;
  border-radius: 0;
}

.full-width-input :deep(.el-input__inner) {
  height: 100%;
  padding: 0 8px;
  border: none;
  text-align: left;
}

.el-table .cell {
  padding: 0;
}

.el-table td.el-table__cell {
  padding: 0;
}
</style>