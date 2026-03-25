<template>
  <h1 class="page-title-text">顧客一覧</h1>
  <SearchComponent class="search-cls" :searchFields="searchFields" :searchUrl="'/pro/contractor/info'" @search="handleSearch" />

  <!-- 搜索框 -->
  <el-card class="result-paging">
  <div class="mb-4">
    <el-button :icon="Plus" type="primary" @click="handleAdd">顧客追加</el-button>
   <!--  <el-button type="warning" :icon="View" @click="handleView">View</el-button>
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
  <el-dialog v-model="addDialogVisible" title="顧客追加"width="80%">
    <AddForm :addUrl="addUrl" @save="saveAdd" @close="closeDialogAdd" detail-row=""/>
    
    <!-- <AddForm :addUrl="addUrl" detail-row=""/> -->
    <template #footer>
      <!-- <el-button @click="addDialogVisible = false">取消</el-button> -->
    </template>
  </el-dialog>

  <!-- 查看对话框 -->
  <el-dialog 
    v-model="viewDialogVisible" 
    :title="`顧客照会 - ${headerName || '未指定'}`" 
    width="80%"
  >
    <EditForm :detailRow="detailRow" :editUrl="editUrl" :isReadOnly="true" @close="closeDialogView" :key="$forceReload()"/>
    <template #footer>
      <!-- <el-button @click="viewDialogVisible = false">取消</el-button> -->
    </template>
  </el-dialog>

  <!-- 编辑对话框 -->
  <el-dialog v-model="editDialogVisible" :title="`顧客編集 - ${headerName || '未指定'}`"width="80%">
    <EditForm :detailRow="detailRow" :editUrl="editUrl" :isReadOnly="false" @save="saveEdit" @close="closeDialogEdit" :key="$forceReload()"/>
    <template #footer>
      <!-- <el-button @click="editDialogVisible = false">取消</el-button> -->
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import SearchComponent from '@/components/SearchComponent.vue'
import TableComt from '@/components/TableComt.vue'
import EditForm from './proContractorInfoEdit.vue';
import AddForm from './proContractorInfoAdd.vue';
import { ArrowLeft, ArrowRight, Delete, Edit, Share, Plus, View, Select } from "@element-plus/icons-vue";
import axios from 'axios';
import '~/assets/css/app.css';

/*init url*/
const editUrl = ref("/pro/contractor/info");
const addUrl = ref("/pro/contractor/info");
const delUrl = ref("/pro/contractor/info");
const viewUrl = ref("/pro/contractor/info");
const pageUrl = ref("/pro/contractor/info/page");

/*init base*/
const tableComtRef = ref(null);
const loadingDel = ref(false);
const tableData = ref([])
const searchData = ref({});


/*init DialogALl*/
const viewDialogVisible = ref(false);
const editDialogVisible = ref(false);
const addDialogVisible = ref(false);
const headerName = ref('');

/*init search fields*/
const searchFields = [
  { label: '顧客ID', prop: 'customerId', maxlength: 32 },
  { label: '見込み顧客ID', prop: 'potId', maxlength: 100 },
  { label: '受付日From', prop: 'dateFrom', inTyp: 'date' },
  { label: '　'+' ～', inTyp: 'label'},
  { label: '受付日To', prop: 'dateTo', inTyp: 'date' },
]

/*init table column fields*/
const tableColumns = [
  { prop: 'proContractorInfo.receptionDate', label: '受付日', width: '150', formatDate: "YYYY-MM-DD HH:mm"},
  { prop: 'aplInquirySource.source', label: '案件流入経路', width: '150', selectKey: "SCM_INFLOW_SOURCE"},
  { prop: 'proContractorInfo.status', label: '対応状況', width: '150', selectKey: "SCM_CUS_RESP_STATUS"},
  { prop: 'proContractorInfo.nextAction', label: '次回アクション', width: '150'},
  { prop: 'proContractorInfo.date', label: '日付', width: '150', formatDate: "YYYY-MM-DD HH:mm"},
  { prop: 'proContractorInfo.consultantName', label: '相談者名', width: '150'},
  { prop: 'proContractInfo.landRegistryLotNumber', label: '土地謄本 地番', width: '200'},
  { prop: 'proContractInfo.landRegistryOwnerName', label: '土地謄本 所有者名', width: '200'},
  { prop: 'proContractorInfo.caseHandler', label: '案件担当者', width: '150'},
  { prop: 'proSupportContent.estimatedCompletionDate', label: '完了予定日', width: '150', formatDate: "YYYY-MM-DD HH:mm"},
  { prop: 'proSupportContent.consultingContractDate', label: 'コンサル契約日', width: '150', formatDate: "YYYY-MM-DD HH:mm"},
  { prop: 'proSupportContent.consultingRevenue', label: 'コンサル売上', width: '150'},
  // { prop: 'proContractorInfo.supportTotalSales', label: 'サポート合計売上', width: '150'},
  { prop: 'proContractorInfo.totalCaseProfit', label: '案件収支合計', width: '150'},
  // { prop: 'proContractorInfo.ankenShishutsuGokei', label: '案件支出合計', width: '150'},
  { prop: 'proContractorInfo.customerId', label: '顧客ID', width: '160'},
]

/*current row data*/
const detailRow = reactive({
  //契約者情報
  proContractorInfo: {
    id: "", 
    potId: "", 
    inquiryId: "", 
    status: "", 
    receptionDate: "", 
    caseHandler: "", 
    customerId: "", 
    consultantName: "", 
    furigana: "", 
    caseSource: "", 
    caseDetails: "", 
    tel: "", 
    mobileNumber: "", 
    emailAddress: "", 
    residencePostalCode: "", 
    residenceArea: "", 
    residenceAddress: "", 
    preferredContactMethod: "", 
    availableDays: "", 
    otherConditions: "", 
    availableTime: "", 
    notes: "", 
    totalCaseProfit: "", 
    grossMarginRate: "", 
    reportCreation: "", 
    ifApplicableCreationStartMonth: "", 
    nextAction: "", 
    date: "", 
    time: "", 
    postalAddress: "",
  },
  //契約情報
  proContractInfo: {
    proId: "", 
    residenceAddress: "", 
    landRegistryOwnerName: "", 
    landRegistryLotNumber: "", 
    contractorName: "", 
    contractShipmentAddress: "", 
    addressee: "", 
    consultingContractShipmentDate: "", 
    depositAnnouncement: "", 
    depositAmount: "", 
    depositPaymentDate: "",
  },
  //サポート内容
  proSupportContent: {
    proId: "", 
    landRegistryLotNumber: "", 
    consultingContractDate: "", 
    estimatedCompletionDate: "", 
    actualCompletionDate: "", 
    consultingRevenue: "", 
    invoiceShipmentDate: "", 
    expectedPaymentDate: "", 
    paymentDate: "", 
    receiptShipmentDate: "", 
    customerSurveyShipmentDate: "", 
    customerSurveyReturned: "",
  }, 
  aplInquirySource: {
    id: "",
    code: "",
    source: "",
  },
});

const saveEdit = (updatedData) => {
  //  需要执行刷新
  refreshTable();
  // 关闭编辑对话框
  closeDialogEdit();
  ElMessage({
    type: 'success',
    message: '保存されました',
    style: 'z-index: 3000;'
  });
};

const saveAdd = (updatedData) => {
  //  需要执行刷新
  refreshTable();
  // 关闭新增对话框
  closeDialogAdd();
  ElMessage({
    type: 'success',
    message: '保存されました',
    style: 'z-index: 3000;'
  });
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

const handleEditRow = (row) => {
  Object.assign(detailRow, JSON.parse(JSON.stringify(row)));
  headerName.value = row.proContractorInfo.consultantName;
  editDialogVisible.value = true;
};

const handleDelRow = async (row) => {
  try {
    const tableResponse = await useNuxtApp().$api(delUrl.value, {
      method: 'DELETE',
      params: {
        id: row.proContractorInfo.id,
      }
    });
    refreshTable();
    // 关闭新增对话框
    ElMessage({
      type: 'success',
      message: 'データは削除されました',
      style: 'z-index: 3000;'
    });
  } catch (error) {
    ElMessage({
      type: 'error',
      message: 'query data error',
      style: 'z-index: 3000;'
    });
  } finally {
    // loadingDel.value=false;
  } // 确保将选中的行数据赋值给 detailRow
};

// 执行双击->选中并关闭对话框
const handleDblRow = (row) => {
  Object.assign(detailRow, row);
  headerName.value = row.proContractorInfo.consultantName;
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
  if (tableComtRef.value && typeof tableComtRef.value.refresh === 'function') {
    tableComtRef.value.refresh(); // 调用 TableComt 的 refresh 方法
  } else {
    console.error('TableComt does not expose a refresh method.');
  }
};
</script>
<style scoped>
.result-paging {
  flex: 1;
}
::v-deep(.el-card__body) {
  height: 100%;
}
</style>
