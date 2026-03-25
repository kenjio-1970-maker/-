<template>
  <SearchComponent class="search-cls" :searchFields="searchFields" :searchUrl="'/biz/cat'" @search="handleSearch" />

  <!-- 搜索框 -->
  <el-card class="result-paging">
    <div class="mb-4">
      <div class="button-group-right">
        <!-- <el-button :icon="Plus">新页面</el-button> -->
        <el-button :icon="Plus" @click="handleAdd">新規</el-button>
        <!-- <el-button type="warning" :icon="View" @click="handleView">View</el-button> -->
        <!-- <el-button type="primary" :icon="Edit" @click="handleEdit">Edit</el-button> -->
        <!-- <el-button type="danger" :icon="Delete" :loading="loadingDel" @click="handleDel">Delete</el-button> -->
        <!-- <el-button type="success" :icon="Select">Submit</el-button> -->
      </div>
    </div>

    <!-- 列表展示框 -->
    <TableComt 
      :tableColumns="tableColumns" 
      :tableUrl="pageUrl" 
      :viewUrl="viewUrl" 
      :editUrl="editUrl" 
      :deleteUrl="delUrl" 
      @edit-row="handleEditRow" 
      @del-row="handleDelRow" 
      @dbl-click-row="handleDblRow" 
      :searchData="searchData"
      ref="tableComtRef"/>
  </el-card>

  <!-- 新增对话框 -->
  <el-dialog v-model="addDialogVisible" title="新增信息">
    <AddForm :addUrl="addUrl" @close="closeDialogAdd" detail-row=""/>
    <template #footer>
      <el-button @click="closeDialogAdd">取消</el-button>
    </template>
  </el-dialog>

  <!-- 查看对话框 -->
  <el-dialog v-model="viewDialogVisible" title="查看信息">
    <EditForm :detailRow="detailRow" :editUrl="editUrl" :isReadOnly="true" @close="closeDialogView"/>
    <template #footer>
      <el-button @click="closeDialogView">取消</el-button>
    </template>
  </el-dialog>

  <!-- 编辑对话框 -->
  <el-dialog v-model="editDialogVisible" title="修改信息">
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
import SearchComponent from '~/components/SearchComponent.vue'
import TableComt from '~/components/TableComt.vue'
import EditForm from './bizCatEdit.vue';
import AddForm from './bizCatAdd.vue';
import { ArrowLeft, ArrowRight, Delete, Edit, Share, Plus, View, Select } from "@element-plus/icons-vue";
import axios from 'axios';
import { sysAppMenu } from '~/stores/sysAppMenu';

const authStore = sysAppMenu();

/*init url*/
const editUrl = ref("/biz/cat");
const addUrl = ref("/biz/cat");
const delUrl = ref("/biz/cat");
const viewUrl = ref("/biz/cat");
const pageUrl = ref("/biz/cat/page");

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
  { label: 'CatName', prop: 'name' },
  { label: 'CatColor', prop: 'color' },
  { label: 'CatBirthday', prop: 'birthday' }
]

/*init table column fields*/
const tableColumns = [
  { prop: 'id', label: 'CatNo', width: '180' },
  { prop: 'name', label: 'CatName', width: '180' },
  { prop: 'color', label: 'CatColor', selectKey: 'SF' },
  // { prop: 'color', label: 'CatColor' },
  { prop: 'birthday', label: 'CatBirthday' },
  { prop: 'birthday', label: '対応日時', width: '150', formatDate: "YYYY-MM-DD HH:mm"},
]

/*current row data*/
const detailRow = reactive({
  id: null,
  name: "",
  color: "",
  birthday: "",
  catDesc: "",
});

const saveEdit = (updatedData) => {
  //  需要执行刷新
};

const handleAdd = () => {
  addDialogVisible.value = true;
}

/* const handleView = () => {
  if (! tableComtRef.value?.currentRow){
    ElMessage.error(`Please select a row of data`)
    return;
  }
  Object.assign(detailRow, tableComtRef.value.currentRow);
  viewDialogVisible.value = true;
} */

/* const handleEdit = () => {
  if (! tableComtRef.value?.currentRow){
    ElMessage.error(`Please select a row of data`)
    return;
  }
  Object.assign(detailRow, tableComtRef.value.currentRow);
  editDialogVisible.value = true;
} */

// const handleDel = async () => {
//   if (! tableComtRef.value?.currentRow) {
//     ElMessage.error(`Please select a row of data`);
//     return ;
//   }
//   try {
//     loadingDel.value=true;
//     const tableResponse = await useNuxtApp().$api(delUrl.value, {
//       method: 'DELETE',
//       params: {
//         id: tableComtRef.value.currentRow.id,
//       }
//     });
//     ElMessage.success('Success');
//     // 需要执行刷新 :todo
//   } catch (error) {
//     ElMessage({type: 'error', message: 'query data error', style: 'z-index: 3000;'});
//   } finally {
//     loadingDel.value=false;
//   }
// }

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
    ElMessage.success('Success');
    // 需要执行刷新 :todo
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
.result-paging {
  border-radius: 4px;
  align-items: center;
  margin-top: 3px;
}
.mb-4 {
  margin-bottom: 8px;
  display: flex;
  justify-content: flex-end;
}
</style>