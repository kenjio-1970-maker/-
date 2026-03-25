<template>
  <h1 class="page-title-text">協力業者一覧</h1>
  <!-- 搜索框 -->
  <SearchComponent class="search-cls" :searchFields="searchFields" :searchUrl="'/biz/partner/info'" @search="handleSearch" />

  <!-- 表格 -->
  <el-card class="result-paging"><!--
  <div class="mb-4">
    <el-button v-perm="'W'" :icon="Plus" @click="handleAdd">New</el-button>
    <el-button v-perm="'R'" type="warning" :icon="View" @click="handleView">View</el-button>
    <el-button v-perm="'W'" type="primary" :icon="Edit" @click="handleEdit">Edit</el-button>
    <el-button v-perm="'X'" type="danger" :icon="Delete" :loading="loadingDel" @click="handleDel">Delete</el-button>
    <el-button type="success" :icon="Select">Submit</el-button>
  </div>-->

    <div class="mb-4">
      <el-button :icon="Plus" type="primary" @click="handleAdd">協力業者追加</el-button>
      <!-- <el-button type="warning" :icon="View" @click="handleView">View</el-button>
      <el-button type="primary" :icon="Edit" @click="handleEdit">Edit</el-button>
      <el-button type="danger" :icon="Delete" :loading="loadingDel" @click="handleDel">Delete</el-button>
      <el-button type="success" :icon="Select">Submit</el-button> -->
    </div>

  <!-- 列表展示框 -->
  <TableComt :tableColumns="tableColumns" 
  :tableUrl="pageUrl" :viewUrl="viewUrl" :editUrl="editUrl" :deleteUrl="delUrl" 
  @edit-row="handleEditRow" 
  @del-row="handleDelRow"
  @dbl-click-row="handleDblRow"
  :searchData="searchData"
  ref="tableComtRef"/>
  </el-card>

  <!-- 新增对话框 -->
  <el-dialog v-model="addDialogVisible" title="協力業者追加"width="80%">
    <AddForm :addUrl="addUrl" @save="saveAdd" @close="closeDialogAdd" detail-row=""/>
    <!-- <template #footer>
      <el-button @click="closeDialogAdd">取消</el-button>
    </template> -->
    <template #footer></template>
  </el-dialog>

  <!-- 查看对话框 -->
  <el-dialog v-model="viewDialogVisible" title="協力業者照会"width="80%">
    <EditForm :detailRow="detailRow" :editUrl="editUrl" :isReadOnly="true" @close="closeDialogView"/>
    <!-- <template #footer>
      <el-button @click="closeDialogView">取消</el-button>
    </template> -->
    <template #footer></template>
  </el-dialog>

  <!-- 编辑对话框 -->
  <el-dialog v-model="editDialogVisible" title="協力業者編集"width="80%">
    <EditForm :detailRow="detailRow" :editUrl="editUrl" :isReadOnly="false" @save="saveEdit" @close="closeDialogEdit"/>
    <!-- <template #footer>
      <el-button @click="closeDialogEdit">取消</el-button>
    </template> -->
    <template #footer></template>
  </el-dialog>

</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import SearchComponent from '@/components/SearchComponent.vue'
import TableComt from '@/components/TableComt.vue'
import EditForm from './bizPartnerInfoEdit.vue';
import AddForm from './bizPartnerInfoAdd.vue';
import { ArrowLeft, ArrowRight, Delete, Edit, Share, Plus, View, Select } from "@element-plus/icons-vue";
import axios from 'axios';
import { sysAppMenu } from '@/stores/sysAppMenu';
import '~/assets/css/app.css';

const authStore = sysAppMenu();

/*init url*/
const editUrl = ref("/biz/partner/info");
const addUrl = ref("/biz/partner/info");
const delUrl = ref("/biz/partner/info");
const viewUrl = ref("/biz/partner/info");
const pageUrl = ref("/biz/partner/info/page");

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
  { prop: 'recordNo', label: 'レコード番号' },
  { prop: 'partnerRank', label: '協力業者ランク' , inTyp: 'select' , selectKey: "BIZ_PARTNER_RANK"},
  { prop: 'industry', label: '業種' , inTyp: 'select' , selectKey: "BIZ_INDUSTRY"},
  { prop: 'registrationDate', label: '登録日',inTyp: 'date' },
]

/*init table column fields*/
const tableColumns = [
  { prop: 'recordType', label: 'レコードタイプ', selectKey: "BIZ_RECORD_TYPE"},
  { prop: 'industry', label: '業種', selectKey: "BIZ_INDUSTRY"},
  { prop: 'companyName', label: '会社名' },
  { prop: 'representativeName', label: '担当者名' },
  { prop: 'prefecture', label: '都道府県', selectKey: "EQ_EMPTY_HOUSE_LOCATION"},
  { prop: 'partnerRank', label: '協力業者ランク', selectKey: "BIZ_PARTNER_RANK"},
]

/*current row data*/
const detailRow = reactive({
  id: "",
  recordNo: "",
  recordType: "",
  partnerRank: "",
  industry: "",
  other: "",
  registrationDate: "",
  companyName: "",
  departmentName: "",
  representativeName: "",
  position: "",
  postalCode: "",
  prefecture: "",
  address: "",
  tel: "",
  fax: "",
  mobile: "",
  email: "",
  homepage: "",
  serviceArea: "",
  serviceAreaDetail: "",
  providedService: "",
  memo: "",
  attachOverview: "",
  attachDetail: "",
  customerCaseLink: "",
});

const saveEdit = (updatedData) => {
  //  需要执行刷新
  refreshTable();
  // 关闭编辑对话框
  closeDialogEdit();
  ElMessage({type: 'success', message: '保存が完了しました。', style: 'z-index: 3000;'});
};

const saveAdd = (updatedData) => {
  //  需要执行刷新
  refreshTable();
  // 关闭新增对话框
  closeDialogAdd();
  ElMessage({type: 'success', message: '保存が完了しました。', style: 'z-index: 3000;'});
};

const handleAdd = () => {
  addDialogVisible.value = true;
}
const closeDialogEdit = () => {
  editDialogVisible.value = false;
};
const closeDialogView = () => {
  viewDialogVisible.value = false;
};
const closeDialogAdd = () => {
  addDialogVisible.value = false;
};

// 组件挂载时调用 handleSearch 获取初始数据
onMounted(() => { 
});
/* const openEditDialog = (row) => {
  Object.assign(detailRow, row); // 复制当前行数据
  editDialogVisible.value = true;
};

const openViewDialog = (row) => {
  Object.assign(detailRow, row); // 复制当前行数据
  viewDialogVisible.value = true;
}; */

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
    // 需要执行刷新 :todo
    refreshTable();
    // 关闭新增对话框
    ElMessage({type: 'success', message: '削除が完了しました。', style: 'z-index: 3000;'});
  } catch (error) {
    ElMessage({type: 'error', message: 'query data error', style: 'z-index: 3000;'});
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
    console.error('TableComt does not expose a refresh method.');
  }
};

//  刷新Table回调函数
const refreshTable = () => {
  //debugger
  if (tableComtRef.value && typeof tableComtRef.value.refresh === 'function') {
    tableComtRef.value.refresh(); // 调用 TableComt 的 refresh 方法
  } else {
    console.error('TableComt does not expose a refresh method.');
  }
};
</script>
<style scoped>
/* 提高 ElNotification 的 z-index */
.el-notification {
  z-index: 3000 !important;
}

/* 确保 el-dialog 的 z-index 不会覆盖 ElNotification */
.el-dialog {
  z-index: 2000 !important;
}

.result-paging {
  flex: 1;
}
::v-deep(.el-card__body) {
  height: 100%;
}

</style>