<template>
  <h1 class="page-title-text">役割一覧</h1>
  <SearchComponent class="search-cls" :searchFields="searchFields" :searchUrl="'/sys/role'" @search="handleSearch" />

  <!-- 搜索框 -->
  <el-card class="result-paging">
  <div class="mb-4">
    <el-button :icon="Plus" type="primary" @click="handleAdd">役割追加</el-button>
<!--     <el-button type="warning" :icon="View" @click="handleView">View</el-button>
    <el-button type="primary" :icon="Edit" @click="handleEdit">Edit</el-button>
    <el-button type="danger" :icon="Delete" :loading="loadingDel" @click="handleDel">Delete</el-button>
    <el-button type="success" :icon="Select">Submit</el-button> -->
  </div>

  <!-- 列表展示框 -->
  <TableComt :tableColumns="tableColumns" :tableUrl="pageUrl" :viewUrl="viewUrl" :editUrl="editUrl" :deleteUrl="delUrl" 
  @edit-row="handleEditRow" 
  @del-row="handleDelRow"
  @dbl-click-row="handleDblRow"
  :searchData="searchData"
  ref="tableComtRef"/>
  </el-card>

  <!-- 新增对话框 -->
  <el-dialog v-model="addDialogVisible" title="役割追加">
    <AddForm :addUrl="addUrl" @close="closeDialogAdd" detail-row=""/>
    <template #footer>
      <el-button @click="closeDialogAdd">取消</el-button>
    </template>
  </el-dialog>

  <!-- 查看对话框 -->
  <el-dialog v-model="viewDialogVisible" title="役割照会">
    <EditForm :detailRow="detailRow" :editUrl="editUrl" :isReadOnly="true" @close="closeDialogView"/>
    <template #footer>
      <el-button @click="closeDialogView">取消</el-button>
    </template>
  </el-dialog>

  <!-- 编辑对话框 -->
  <el-dialog v-model="editDialogVisible" title="役割編集">
    <EditForm :detailRow="detailRow" :editUrl="editUrl" :isReadOnly="false" @save="saveEdit" @close="closeDialogEdit"/>
    <template #footer>
      <el-button @click="closeDialogEdit">取消</el-button>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import SearchComponent from '@/components/SearchComponent.vue'
import TableComt from '@/components/TableComt.vue'
import EditForm from './sysRoleEdit.vue';
import AddForm from './sysRoleAdd.vue';
import { ArrowLeft, ArrowRight, Delete, Edit, Share, Plus, View, Select } from "@element-plus/icons-vue";
import axios from 'axios';
import { sysAppMenu } from '@/stores/sysAppMenu';
import '~/assets/css/app.css';

const authStore = sysAppMenu();

/*init url*/
const editUrl = ref("/sys/role");
const addUrl = ref("/sys/role");
const delUrl = ref("/sys/role");
const viewUrl = ref("/sys/role");
const pageUrl = ref("/sys/role/page");

/*init base*/
const tableComtRef = ref(null);
const loadingDel = ref(false);
const tableData = ref([])
const searchData = ref({});

/*init DialogALl*/
const viewDialogVisible = ref(false);
const editDialogVisible = ref(false);
const addDialogVisible = ref(false);

/*init search fields*/
const searchFields = [
  { label: '役割名称', prop: 'roleName' },
  { label: '役割コード', prop: 'roleCode' },
]

/*init table column fields*/
const tableColumns = [
{ prop: 'id', label: '役割番号' },
{ prop: 'roleName', label: '役割名称' },
{ prop: 'roleCode', label: '役割コード' },
{ prop: 'roleType', label: '役割タイプ' },
{ prop: 'createUser', label: '作成者' },
{ prop: 'updateUser', label: 'アップデート者' },
{ prop: 'createAt', label: '作成時間' },
{ prop: 'updateAt', label: 'アップデート時間' },
]

/*current row data*/
const detailRow = reactive({
  id: "", 
  roleName: "", 
  roleCode: "", 
  roleType: "", 
  createUser: "", 
  updateUser: "", 
  createAt: "", 
  updateAt: "", 
});

const saveEdit = (updatedData) => {
  //  需要执行刷新
};

const handleAdd = () => {
  addDialogVisible.value = true;
}
/* 
const handleView = () => {
  if (! tableComtRef.value?.currentRow){
    ElMessage({type: 'error', message: `Please select a row of data`, style: 'z-index: 3000;'});
    return;
  }
  Object.assign(detailRow, tableComtRef.value.currentRow);
  viewDialogVisible.value = true;
}

const handleEdit = () => {
  if (! tableComtRef.value?.currentRow){
    ElMessage.error(`Please select a row of data`)
    return;
  }
  Object.assign(detailRow, tableComtRef.value.currentRow);
  editDialogVisible.value = true;
}

const handleDel = async () => {
  if (! tableComtRef.value?.currentRow) {
    ElMessage.error(`Please select a row of data`);
    return ;
  }
  try {
    loadingDel.value=true;
    const tableResponse = await useNuxtApp().$api(delUrl.value, {
      method: 'DELETE',
      params: {
        id: tableComtRef.value.currentRow.id,
      }
    });
    ElMessage.success('Success');
    // 需要执行刷新 :todo
  } catch (error) {
    ElMessage.error('query data error');
  } finally {
    loadingDel.value=false;
  }
} */

const closeDialogEdit = () => {
  editDialogVisible.value = false;
};
const closeDialogView = () => {
  viewDialogVisible.value = false;
};
const closeDialogAdd = () => {
  addDialogVisible.value = false;
};


// const editRow = reactive({
//   id: null,
//   customerName: "",
//   phoneNumber: "",
//   address: ""
// });

/*const searchForm = reactive({
  customerName: '',
  phone: '',
  address: ''
})*/

// 搜索字段
/*const searchFields = [
  { label: '客户名称', prop: 'customerName' },
  { label: '联系电话', prop: 'phone' },
  { label: '地址', prop: 'address' }
]*/
// 组件挂载时调用 handleSearch 获取初始数据
onMounted(() => {
  try {
    const route = useRoute();
    const currentPath = route.path;

    authStore.getTest();
  } catch (error) {
    console.error('ルート情報の取得に失敗しました。:', error);
  }
});
const openEditDialog = (row) => {
  Object.assign(detailRow, row); // 复制当前行数据
  editDialogVisible.value = true;
};

const openViewDialog = (row) => {
  Object.assign(detailRow, row); // 复制当前行数据
  viewDialogVisible.value = true;
};

const handleEditRow = (row) => {
  Object.assign(detailRow, row);
  editDialogVisible.value = true;
};

const handleDelRow = async (row) => {
  try {
    const tableResponse = await useNuxtApp().$api(delUrl.value, {
      method: 'DELETE',
      params: {
        id: row.id,
      }
    });
    ElMessage({ type: 'success', message: 'Success', style: 'z-index: 3000;' });
    // 需要执行刷新 :todo
  } catch (error) {
    ElMessage({ type: 'error', message: 'query data error', style: 'z-index: 3000;' });
  } finally {
    // loadingDel.value=false;
  }
};

const handleDblRow = (row) => {
  Object.assign(detailRow, row);
  viewDialogVisible.value = true;
};

// 搜索回调函数
const handleSearch = (paramSearch) => {
  searchData.value = paramSearch; // 更新 searchData
  console.log("Updated searchData:", searchData.value); // 打印更新后的 searchData
  if (tableComtRef.value && typeof tableComtRef.value.refresh === 'function') {
    tableComtRef.value.refresh(); // 调用 TableComt 的 refresh 方法
  } else {
    ElMessage({ type: 'error', message: 'TableComt does not expose a refresh method.', style: 'z-index: 3000;' });
  }
};

//  刷新Table回调函数
const refreshTable = () => {
  if (tableComtRef.value && typeof tableComtRef.value.refresh === 'function') {
    tableComtRef.value.refresh(); // 调用 TableComt 的 refresh 方法
  } else {
    console.error('TableComt does not expose a refresh method.');
  }
};

</script>
<style scoped>
/* .result-paging {
  border-radius: 10px;
  align-items: center;
  margin-top: 3px;
}
.mb-4 {
  margin-bottom: 8px;
  display: inline;
} */
.result-paging {
  flex: 1;
}
::v-deep(.el-card__body) {
  height: 100%;
}
</style>