<template>
  <h1 v-if="isshowBtn" class="page-title-text">問い合わせ一覧</h1>
  <SearchComponent class="search-cls" :fromPotential= fromPotential :searchFields="searchFields" :searchUrl="pageUrl" @search="handleSearch" />

  <!-- 搜索框 -->
  <el-card class="result-paging">
  <div class="mb-4" v-if="isshowBtn">
    <el-button :icon="Plus" type="primary" @click="handleAdd">問い合わせ追加</el-button>
    <!-- <el-button type="warning" :icon="View" @click="handleView">View</el-button>
    <el-button type="primary" :icon="Edit" @click="handleEdit">Edit</el-button>
    <el-button type="danger" :icon="Delete" :loading="loadingDel" @click="handleDel">Delete</el-button>
    <el-button type="success" :icon="Select">Submit</el-button> -->
  </div>

  <!-- 列表展示框 -->
  <TableComt 
    :tableColumns="tableColumns" 
    :tableUrl="pageUrl" 
    :viewUrl="viewUrl" 
    :editUrl="editUrl" 
    :deleteUrl="delUrl" 
    :searchData="searchData"
    @edit-row="handleEditRow" 
    @del-row="handleDelRow"
    @dbl-click-row="handleDblRow"
    @row-click="handleRowClick"
    :isshowBtn="isshowBtn"
    ref="tableComtRef" />
  </el-card>

  <!-- 新增对话框 -->
  <el-dialog v-model="addDialogVisible" title="問い合わせ追加"width="80%">
    <AddForm :addUrl="addUrl" @save="saveAdd" @close="closeDialogAdd" detail-row=""/>
   <!-- <AddForm :addUrl="addUrl" @close="closeDialogAdd" detail-row=""/>
    <template #footer>
      <el-button @click="closeDialogAdd">取消</el-button>
    </template> -->
    <template #footer>
    </template>
  </el-dialog>

  <!-- 查看对话框 -->
  <el-dialog v-model="viewDialogVisible" title="問い合わせ照会"width="80%">
    <EditForm :detailRow="detailRow" :editUrl="editUrl" :isReadOnly="true" @close="closeDialogView" :key="$forceReload()"/>
    <!-- <template #footer>
      <el-button @click="closeDialogView">取消</el-button>
    </template> -->
    <template #footer>
    </template>
  </el-dialog>

  <!-- 编辑对话框 -->
  <el-dialog v-model="editDialogVisible" title="問い合わせ編集"width="80%">
    <EditForm :detailRow="detailRow" :editUrl="editUrl" :isReadOnly="false" @save="saveEdit" @close="closeDialogEdit" :key="$forceReload()"/>
    <!-- <template #footer>
      <el-button @click="closeDialogEdit">取消</el-button>
    </template> -->
    <template #footer>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import { ref, reactive, nextTick, onMounted, onBeforeUpdate } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import SearchComponent from '@/components/SearchComponent.vue'
import TableComt from '@/components/TableComt.vue'
import EditForm from './aplInquiryMgntEdit.vue';
import AddForm from './aplInquiryMgntAdd.vue';
import { ArrowLeft, ArrowRight, Delete, Edit, Share, Plus, View, Select } from "@element-plus/icons-vue";
import axios from 'axios';

const props = defineProps({

  // 引入列表: 不展示按钮
  isshowBtn: { type: Boolean, required: false, default: true },
  fromPotential: { type: Boolean, required: false, default: false },
  userKbn: { type: Boolean, required: false, default: false },
})
/*init url*/
const editUrl = ref("/apl/inquiry_mgnt");
const addUrl = ref("/apl/inquiry_mgnt");
const delUrl = ref("/apl/inquiry_mgnt");
const viewUrl = ref("/apl/inquiry_mgnt");
const pageUrl = ref("/apl/inquiry_mgnt/page");

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
  { label: '流入経路', prop: 'aplSource', inTyp:'select', selectUrl:"/apl/qryAplInquirySource",keyName :"code",labelName :"source" },
  { label: '相談者名', prop: 'customerName', maxlength: 100 },
  { label: '対応日From', prop: 'dateFrom', inTyp: 'datetime' ,width:'200px'},
  { label: '　'+' ～', inTyp: 'label'},
  { label: '対応日To', prop: 'dateTo', inTyp: 'datetime',width:'200px'},
  // { prop: 'loginEmail', label: 'ログイン用Eメール'},
  // { prop: 'customerName', label: '相談者名' },
  // { prop: 'dateFrom', label: '日付From' },
  // { prop: 'dateTo', label: '日付To' },
]

/*init table column fields width: '180' */
/* { prop: 'aplInquirySource.updateAt', label: '流入経路22222', width: '200'},
{ prop: 'aplInquirySource.createAt', label: '流入経路22222', width: '200'},  */
const tableColumns = [
  { prop: 'aplInquiryMgnt.handlingDate', label: '相談受付日', width: '150', formatDate: "YYYY-MM-DD HH:mm"},
  { prop: 'aplInquiryMgnt.handlingStatus', label: '対応状況', width: '140', selectKey: "SCM_INQUIRY_RESP_STATUS"},
  { prop: 'aplInquirySource.source', label: '流入経路', width: '180'},
  { prop: 'aplInquiryMgnt.customerName', label: '相談者名', width: '200'},
  { prop: 'aplInquiryMgnt.nameFurigana', label: 'フリガナ', width: '150'},
  { prop: 'aplInquiryMaster.Q13(1)-1', label: '希望送付手段', width: '200', selectKey: "FORM_REPORT_SHIPPING_METHOD"},
  { prop: 'aplInquiryMgnt.reportSts', label: '送付結果', width: '120', selectKey: "STSTE_SEND_REPORT"},
  { prop: 'aplInquiryMgnt.aplRank', label: 'ランク', width: '100'},
  { prop: 'aplInquiryMgnt.id', label: '問合せID', width: '200'},
]

/*current row data*/
const detailRow = reactive({
  aplInquiryMgnt:{
    id: "",
    handlingDate: "",
    handlingStatus: "",
    loginEmail: "",
    customerName: "",
    nameFurigana: "",
    currentRegion: "",
    phoneNumber: "",
    contactEmail: "",
    age: "",
    gender: "",
    occupation: "",
    reportRecipientName: "",
    reportRecipientEmail: "",
    createUser: "",
    updateUser: "",
    createAt: "",
    updateAt: "",
    aplRank: "",
  },
  aplInquiryMaster: {
    Q1: "",
    Q2: "",
    Q3: "",
    Q5: "",
    Q6: "",
    Q11: "",
    Q12: "",
    Q13: "",
    Q14: "",
    Q15: "",
    Q1501: "",
    'Q13(1)-1': "",
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

 // 列表选择回传Start
 const emit = defineEmits(['select-element'])
  const handleRowClick = (row) => {
  console.log('Row clicked:', row)
    if (row) {
    emit('select-element', row)
    }
  }
// 列表选择回传Overall*/


const closeDialogEdit = () => {
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
  Object.assign(detailRow, row);
  editDialogVisible.value = true;
};

const handleDelRow = async (row) => {
  try {
    const tableResponse = await useNuxtApp().$api(delUrl.value, {
      method: 'DELETE',
      params: {
        id: row.aplInquiryMgnt.id,
      }
    });
    // ElMessage.success('Success');
    // 需要执行刷新 :todo
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
