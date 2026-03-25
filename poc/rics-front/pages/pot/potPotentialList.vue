<template>
  <h1 v-if="isshowBtn" class="page-title-text">見込み顧客一覧</h1>
  <SearchComponent class="search-cls" :fromPotential= fromPotential :searchFields="searchFields" :searchUrl="pageUrl" @search="handleSearch" />
  <!-- 搜索框 -->
  <el-card class="result-paging">
  <div class="mb-4" v-if="isshowBtn">
    <el-button :icon="Plus" type="primary" @click="handleAdd">見込み顧客追加</el-button>
    <!-- <el-button type="warning" :icon="View" @click="handleView">View</el-button>
    <el-button type="primary" :icon="Edit" @click="handleEdit">Edit</el-button>
    <el-button type="danger" :icon="Delete" :loading="loadingDel" @click="handleDel">Delete</el-button>
    <el-button type="success" :icon="Select">Submit</el-button> -->
  </div>

  <!-- 列表展示框 -->
  <TableComt :tableColumns="tableColumns" :tableUrl="pageUrl" :viewUrl="viewUrl" :editUrl="editUrl" :deleteUrl="delUrl" 
  @edit-row="handleEditRow" 
  @del-row="handleDelRow"
  @dbl-click-row="handleDblRow"
  @row-click="handleRowClick"
  :searchData="searchData"
  :isshowBtn="isshowBtn"
  ref="tableComtRef"/>
  </el-card>

  <!-- 新增对话框 -->
  <el-dialog v-model="addDialogVisible" title="見込み顧客追加"width="80%">
    <AddForm :addUrl="addUrl" @save="saveAdd" @close="closeDialogAdd" detail-row=""/>
    <!-- <AddForm :addUrl="addUrl" @close="closeDialogAdd" detail-row="" :key="$forceReload()"/> -->
    <template #footer>
      <!-- <el-button @click="closeDialogAdd">取消</el-button> -->
    </template>
  </el-dialog>

  <!-- 查看对话框 -->
  <el-dialog v-model="viewDialogVisible" title="見込み顧客照会" width="80%" >
    <EditForm :detailRow="detailRow" :editUrl="editUrl" :isReadOnly="true" @close="closeDialogView" :key="$forceReload()"/>
    <template #footer>
      <!-- <el-button @click="closeDialogView">取消</el-button> -->
    </template>
  </el-dialog>

  <!-- 编辑对话框 -->
  <el-dialog v-model="editDialogVisible" title="見込み顧客編集"width="80%">
    <EditForm :detailRow="detailRow" :editUrl="editUrl" :isReadOnly="false" @save="saveEdit" @close="closeDialogEdit" :key="$forceReload()"/>
    <template #footer>
      <!-- <el-button @click="closeDialogEdit">取消</el-button> -->
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import SearchComponent from '@/components/SearchComponent.vue'
import TableComt from '@/components/TableComt.vue'
import EditForm from './potPotentialEdit.vue';
import AddForm from './potPotentialAdd.vue';
import { ArrowLeft, ArrowRight, Delete, Edit, Share, Plus, View, Select } from "@element-plus/icons-vue";
import axios from 'axios';
import '~/assets/css/app.css';

// 跳转用户选择
const props = defineProps({
  isshowBtn: { type: Boolean, required: false, default: true },
  fromPotential: { type: Boolean, required: false, default: false },
})

/*init url*/
const editUrl = ref("/pot/potential/master");
const addUrl = ref("/pot/potential/master");
const delUrl = ref("/pot/potential/master");
const viewUrl = ref("/pot/potential/master");
const pageUrl = ref("/pot/potential/master/page");

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
  { label: '案件ID', prop: 'id', maxlength: 100  },
  { label: '相談者名', prop: 'consultantName', maxlength: 100 },
  { label: '受付日From', prop: 'dateFrom', inTyp: 'date' ,width: '200px'},
  { label: '　'+' ～', inTyp: 'label'},
  { label: '受付日To', prop: 'dateTo', inTyp: 'date' ,width: '200px'},
]

/*init table column fields*/
const tableColumns = [
  { prop: 'potPotentialMaster.receptionDate', label: '受付日', width: '150', formatDate: "YYYY-MM-DD HH:mm"},
  { prop: 'aplInquirySource.source', label: '案件流入経路', width: '300'},
  { prop: 'potPotentialMaster.handlingStatus', label: '対応状況', width: '150', selectKey: "SCM_POTENTIAL_RESP_STATUS"},
  { prop: 'potPotentialMaster.nextAction', label: '次回アクション', width: '150'},
  { prop: 'potPotentialMaster.nextPromiseDate', label: '次回約束日', width: '150', formatDate: "YYYY-MM-DD HH:mm"},
  { prop: 'potCustomerInfo.consultantName', label: '相談者名', width: '150'},
  { prop: 'potRealEstateSummary.landRegistryLotNumber', label: '土地謄本 地番', width: '150' },
  { prop: 'potRealEstateSummary.landRegistryOwnerName', label: '土地謄本 所有者名', width: '180' },
  { prop: 'potRealEstateSummary.landArea', label: '土地面積', width: '150' },
  { prop: 'potPotentialMaster.potRank', label: '案件ランク', width: '150'},
  { prop: 'potPotentialMaster.certainty', label: '確度', width: '150'},
  { prop: 'potPotentialMaster.consultationDate', label: '相談実施日', width: '200', formatDate: "YYYY-MM-DD HH:mm"},
  { prop: 'potPotentialMaster.consultingContract', label: 'コンサル契約', width: '200', selectKey:"SCM_CONSULTING_STAGE"},
  { prop: 'potNeedsInfo.cleaningNeeds', label: '片付けニーズ', width: '150', selectKey:"SCM_NEEDS"},
  { prop: 'potNeedsInfo.fireDamageNeeds', label: '火災ニーズ', width: '150', selectKey:"SCM_NEEDS"},
  { prop: 'potNeedsInfo.managementNeeds', label: '管理ニーズ', width: '150', selectKey:"SCM_NEEDS"},
  { prop: 'potNeedsInfo.buddhistAltarGraveNeeds', label: '仏壇お墓ニーズ', width: '150', selectKey:"SCM_NEEDS"},
]

/*current row data*/
const detailRow = reactive({
  //意向顧客テーブル
  potPotentialMaster: {
    id: "",
    inquiryId: "",
    handlingStatus: "",
    receptionDate: "",
    potSource: "",
    potDetails: "",
    potRank: "",
    certainty: "",
    potManagerWorker: "",
    potManagerCt: "",
    nextAction: "",
    nextPromiseDate: "",
    nextPromiseTime: "",
    reportCreationDate: "",
    reportSendingDate: "",
    saRankNotificationDate: "",
    interviewAppointmentDate: "",
    consultationDate: "",
    interviewRank: "",
    consultingContract: "",
    consultingContractDoc: "",
    contractSendingDate: "",
    contractSendingWorker: "",
    lostReason: "",
    lostCustomerSurveyDate: "",
    customerId: "",
    entryWorker: "",
    entryDate: "",
  },
  //不動産概要テーブル
  potRealEstateSummary: {
    id: "",
    potId: "",
    landRegistryOwnerName: "",
    landRegistryLotNumber: "",
    landUse: "",
    zoning: "",
    landArea: "",
    landUsageStatus: "",
    houseNumber: "",
    buildingRegistryOwnerName: "",
    buildingAge: "",
    totalFloorArea: "",
    buildingStructure: "",
    numberOfFloors: "",
    isBasement: "",
  },
  //ニーズ情報テーブル
  potNeedsInfo: {
    id: "",
    potId: "",
    cleaningNeeds: "",
    fireDamageNeeds: "",
    insuranceCompany: "",
    managementNeeds: "",
    buddhistAltarGraveNeeds: "",
    inheritanceRegistration: "",
  },
  //相谈情报テーブル
  potCustomerInfo: {
    id: "",
    customerId: "",
    consultantName: "",
    furigana: "",
    phoneNumber: "",
    mobileNumber: "",
    emailAddress: "",
    reportSendingEmail: "",
    currentResidence: "",
    residence: "",
    residencePostalCode: "",
    residenceAddress: "",
    postalAddress: "",
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
  ElMessage({type: 'success', message: '保存されました', style: 'z-index: 3000;'});
};

const saveAdd = (updatedData) => {
  //  需要执行刷新
  refreshTable();
  // 关闭新增对话框
  closeDialogAdd();
  ElMessage({type: 'success', message: '保存されました', style: 'z-index: 3000;'});
};

const handleAdd = () => {
  addDialogVisible.value = true;
}


const closeDialogEdit = () => {
  refreshTable();
  editDialogVisible.value = false;
};
const closeDialogView = () => {
  viewDialogVisible.value = false;
};
const closeDialogAdd = () => {
  addDialogVisible.value = false;
};

const openEditDialog = (row) => {
  Object.assign(detailRow, row); // 复制当前行数据
  editDialogVisible.value = true;
};

const openViewDialog = (row) => {
  Object.assign(detailRow, row); // 复制当前行数据
  viewDialogVisible.value = true;
};
const handleEditRow = (row) => {
  Object.assign(detailRow, JSON.parse(JSON.stringify(row)));
  editDialogVisible.value = true;
};

const handleDelRow = async (row) => {
  try {
    const tableResponse = await useNuxtApp().$api(delUrl.value, {
      method: 'DELETE',
      params: {
        id: row.potPotentialMaster.id,
      }
    });
    refreshTable();
    // 关闭新增对话框
    ElMessage({type: 'success', message: 'データは削除されました', style: 'z-index: 3000;'});
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

// 列表选择回传Start
const emit = defineEmits(['select-element'])
const handleRowClick = (row) => {
  // console.log('Row clicked:', row)
  if (row) {
    emit('select-element', row)
  }
}
// 列表选择回传Overall


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
/* .result-paging {
  border-radius: 10px;
  align-items: center;
  margin-top: 3px;
} */
/* .mb-4 {
  margin-bottom: 8px;
  display: inline;
} */

</style>