<template>
  <h1 v-if="isshowBtn" class="page-title-text">ユーザ一覧</h1>
  <SearchComponent class="search-cls" :fromPotential= fromPotential :userKbn= userKbn :searchFields="searchFields" :searchUrl="'/sys/user'" @search="handleSearch" />

  <!-- 搜索框 -->
  <el-card class="result-paging">
  <div class="mb-4" v-if="isshowBtn">
    <el-button :icon="Plus" type="primary" @click="handleAdd">ユーザー追加</el-button>
    <!-- <el-button type="primary" :icon="Edit" @click="handleDual">Dual</el-button> -->
<!--     <el-button type="warning" :icon="View" @click="handleView">View</el-button>
    <el-button type="primary" :icon="Edit" @click="handleEdit">Edit</el-button>
    <el-button type="primary" :icon="Edit" @click="handleDual">Dual</el-button>
    <el-button type="danger" :icon="Delete" :loading="loadingDel" @click="handleDel">Delete</el-button>
    <el-button :icon="Select">Submit</el-button> -->
  </div>

  <!-- 列表展示框 -->
  <TableComt :tableColumns="tableColumns" 
  :tableUrl="pageUrl" :viewUrl="viewUrl" :editUrl="editUrl" :deleteUrl="delUrl" 
  @row-click="handleRowClick" 
  @edit-row="handleEditRow" 
  @del-row="handleDelRow"
  @dbl-click-row="handleDblRow"
  :highlightCurRow="true"
  :searchData="searchData"
  :isshowBtn="isshowBtn"
  ref="tableComtRef"/>
  
  </el-card>

  <!-- 新增对话框 -->
  <el-dialog v-model="addDialogVisible" title="ユーザー追加" width="80%">
    <AddForm :addUrl="addUrl" @save="saveAdd" @close="closeDialogAdd" detail-row=""/>
    <!-- <AddForm :addUrl="addUrl" @close="handleCloseAddDialog" detail-row=""/> -->
    <template #footer>
      <!-- <el-button @click="handleCloseAddDialog">取消</el-button> -->
    </template>
  </el-dialog>

  <!-- 查看对话框 -->
  <el-dialog v-model="viewDialogVisible" title="ユーザー照会" width="80%">
    <EditForm :userId="detailRow.id" :getUrl="getUrl" :editUrl="editUrl" :isReadOnly="true" @close="closeDialogView" :key="$forceReload()"/>
    <!-- <EditForm :detailRow="detailRow" :editUrl="editUrl" :isReadOnly="true" @close="handleCloseViewDialog"/> -->
    <template #footer>
      <!-- <el-button @click="closeDialogView">取消</el-button> -->
    </template>
  </el-dialog>

  <!-- 编辑对话框 -->
  <el-dialog v-model="editDialogVisible" title="ユーザー編集" width="80%">
    <EditForm :userId="detailRow.id" :getUrl="getUrl" :editUrl="editUrl" :isReadOnly="false" @save="saveEdit" @close="closeDialogEdit" :key="$forceReload()"/>
    <!-- <EditForm :detailRow="detailRow" :editUrl="editUrl" :isReadOnly="false" @save="saveEdit" @close="handleCloseEditDialog"/> -->
    <template #footer>
      <!-- <el-button @click="closeDialogEdit">取消</el-button> -->
    </template>
  </el-dialog>

  <!-- Dual对话框 -->
  <el-dialog v-model="dualDialogVisible" title="顧客と役割の設定">
    <dualListBox :urlList="dualUrlList" :urlSubmit="dualUrlSubmit" :bizNo="dualBizNo" :key="dualBizNo" @close="closeDialogDual"/>
    <template #footer>
      <el-button @click="closeDialogDual">Close</el-button>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import SearchComponent from '@/components/SearchComponent.vue'
import dualListBox from '@/components/DualListBox.vue'
import TableComt from '@/components/TableComt.vue'
import EditForm from './sysUserEdit.vue';
import AddForm from './sysUserAdd.vue';
import { ArrowLeft, ArrowRight, Delete, Edit, Share, Plus, View, Select } from "@element-plus/icons-vue";
import axios from 'axios';
import '~/assets/css/app.css';
import { isVisible } from 'element-plus/es/utils/index.mjs'

// 跳转用户选择
const props = defineProps({
  isshowBtn: { type: Boolean, required: false, default: true },
  fromPotential: { type: Boolean, required: false, default: false },
  userKbn: { type: String, required: false },
})

/*init url*/
const getUrl = ref("/sys/user");
const editUrl = ref("/sys/user");
const addUrl = ref("/sys/user");
const delUrl = ref("/sys/user");
const viewUrl = ref("/sys/user");
const pageUrl = ref("/sys/user/page");
const dualUrlList = ref("/sys/user/dual/qry");
const dualUrlSubmit = ref("/sys/user/page");
const dualBizNo = ref("");

/*init base*/
const tableComtRef = ref(null);
const loadingDel = ref(false);
const tableData = ref([])
const searchData = ref({});

/*init DialogALl*/
const viewDialogVisible = ref(false);
const editDialogVisible = ref(false);
const dualDialogVisible = ref(false);
const addDialogVisible = ref(false);

/*init search fields*/
const searchFields = [
  { label: 'ユーザーID', prop: 'fullName' },
  { label: 'ユーザー区分', prop: 'userType', inTyp: 'select', selectKey: 'SYS_USER_TYPE', width: '180px'},
]

/*init table column fields*/
const tableColumns = [
// { prop: 'userName', label: 'ユーザーID' },
{ prop: 'fullName', label: 'ユーザーID' },
{ prop: 'userType', label: 'ユーザー区分', selectKey: 'SYS_USER_TYPE'},
]

/*current row data*/
const detailRow = reactive({
  id: "", 
  userName: "", 
  // userPasswd: "", 
  userType: "", 
  email: "", 
  createUser: "", 
  updateUser: "", 
  createAt: "", 
  updateAt: "", 
});



const saveEdit = (updatedData) => {
  // ユーザー情報を更新された後、ユーザーIDを空にする
  detailRow.id = '';
  //  需要执行刷新
  refreshTable();
  // 关闭编辑对话框
  closeDialogEdit();
  ElMessage.success('保存されました');
};

const saveAdd = (updatedData) => {
  //  需要执行刷新
  refreshTable();
  // 关闭新增对话框
  closeDialogAdd();
  ElMessage.success('保存されました');
};

const handleAdd = () => {
  addDialogVisible.value = true;
}
/* 
const handleView = () => {
  if (! tableComtRef.value?.currentRow){
    ElMessage.error(`Please select a row of data`)
    return;
  }
  Object.assign(detailRow, tableComtRef.value.currentRow);
  viewDialogVisible.value = true;
} */
/* 
const handleEdit = () => {
  if (! tableComtRef.value?.currentRow){
    ElMessage.error(`Please select a row of data`)
    return;
  }
  Object.assign(detailRow, tableComtRef.value.currentRow);
  editDialogVisible.value = true;
} */
const handleDual = () => {
  if (! tableComtRef.value?.currentRow){
    ElMessage.error(`Please select a row of data`)
    return;
  }
  Object.assign(detailRow, tableComtRef.value.currentRow);
  dualBizNo.value = detailRow.id;
  dualDialogVisible.value = true;
}

/* const handleDel = async () => {
  if (! tableComtRef.value?.currentRow) {
    ElMessage.error(`Please select a row of data`);
    return ;
  }
  try {
    loadingDel.value=true;
    const tableResponse = await useNuxtApp().$api(delUrl.value, {
      method: 'DELETE',
      body: {
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
}
 */
const handleCloseEditDialog = () => {
  editDialogVisible.value = false;
};
const handleCloseDualDialog = () => {
  dualDialogVisible.value = false;
};
const handleCloseViewDialog = () => {
  viewDialogVisible.value = false;
};
const handleCloseAddDialog = () => {
  addDialogVisible.value = false;
};

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

  } catch (error) {
    console.error('ルート情報の取得に失敗しました。:', error);
  }
});
const openEditDialog = (row) => {
  //Object.assign(detailRow, row); // 复制当前行数据
  Object.assign(detailRow, JSON.parse(JSON.stringify(row)));
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

const handleDblRow = (row) => {
  Object.assign(detailRow, row);
  viewDialogVisible.value = true;
};

// 列表选择回传Start
const emit = defineEmits(['select-userWorker','select-userCt'])
const handleRowClick = (row) => {
  console.log('Row clicked:', row)
  if (row) {
    emit('select-userWorker', row)
    emit('select-userCt', row)
  }
}

// const handleRowCtClick = (row) => {
//   console.log('Row clicked:', row)
//   if (row) {
//     emit('select-userCt', row)
//   }
// }
// 列表选择回传Overall

const handleDelRow = async (row) => {
  try {
    const response = await useNuxtApp().$api(`${delUrl.value}/${row.id}`, {
      method: 'DELETE'
    });
    if (response && response.fail){
      ElMessage.error(response.msg);
      return;
    }
    refreshTable();
    // 关闭新增对话框
    ElMessage.success('データは削除されました');
  } catch (error) {
    ElMessage.error('query data error');
  } finally {
    // loadingDel.value=false;
  }
};

// 搜索回调函数
const handleSearch = (paramSearch) => {
  searchData.value = paramSearch; // 更新 searchData
  console.log("Updated searchData:", searchData.value); // 打印更新后的 searchData
  if (tableComtRef.value && typeof tableComtRef.value.refresh === 'function') {
    tableComtRef.value.refresh(); // 调用 TableComt 的 refresh 方法
  } else {
    console.error('TableComt does not expose a refresh method.');
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
  display: flex;
  justify-content: flex-end;
} */
.result-paging {
  flex: 1;
}
::v-deep(.el-card__body) {
  height: 100%;
}
</style>
