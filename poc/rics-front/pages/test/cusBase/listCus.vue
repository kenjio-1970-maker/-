<template>


  <SearchComponent class="search-cls" :searchFields="searchFields" :searchUrl="'/cusBase/page'" @search="handleSearch" />
  <el-card class="result-paging">
  <div class="mb-4">
    <el-button :icon="Plus" @click="handleAdd">新增</el-button>
    <el-button type="warning" :icon="View" @click="handleView">查看</el-button>
    <el-button type="primary" :icon="Edit" @click="handleEdit">修改</el-button>
    <el-button type="danger" :icon="Delete" :loading="loadingDel" @click="handleDel">删除</el-button>
    <el-button type="success" :icon="Select">提交</el-button>
    <!--    <el-button type="danger" :icon="Delete">删除</el-button>-->
<!--    <el-button type="danger" :icon="Delete" @click="loadingFun">取消加载</el-button>-->
    <!--    <el-button type="info">灰色</el-button>-->
  </div>
  <TableComt :tableColumns="tableColumns" :tableUrl="'/cusBase/page'" :viewUrl="'/cusBase/view'" :editUrl="'/cusBase/edit'" :deleteUrl="'/cusBase'" ref="tableComtRef"/>

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
import EditForm from './listCusEdit.vue'; // 引入子组件
import AddForm from './listCusAdd.vue'; // 引入子组件
import { ArrowLeft, ArrowRight, Delete, Edit, Share, Plus, View, Select } from "@element-plus/icons-vue";

const tableComtRef = ref(null); // 获取子组件实例
const loadingDel = ref(false);
const editUrl = ref("/cusBase");
const addUrl = ref("/cusBase");
// const delUrl = ref("/cusBase/delete");
const delUrl = ref("/cusBase");
import axios from 'axios';
const searchForm = reactive({
  customerName: '',
  phone: '',
  address: ''
})
// 表格数据
const tableData = ref([])
// 搜索字段
const searchFields = [
  { label: '客户名称', prop: 'customerName' },
  { label: '联系电话', prop: 'phone' },
  { label: '地址', prop: 'address' }
]

// 表格列
const tableColumns = [
  { prop: 'customerName', label: '客户名称', width: '180' },
  { prop: 'phone', label: '联系电话', width: '180' },
  { prop: 'address', label: '地址' },
  { prop: 'email', label: '邮箱' },
  { prop: 'createTime', label: '创建时间' },
  { label: '操作', width: '280' }
]

const detailRow = reactive({
  id: null,
  customerName: "",
  phoneNumber: "",
  address: ""
});

// 查看对话框
const viewDialogVisible = ref(false); // 控制对话框的显示
// 编辑对话框
const editDialogVisible = ref(false); // 控制对话框的显示
// 编辑对话框
const addDialogVisible = ref(false); // 控制对话框的显示
// const editRow = reactive({
//   id: null,
//   customerName: "",
//   phoneNumber: "",
//   address: ""
// });

// 打开编辑对话框
const openEditDialog = (row) => {
  Object.assign(detailRow, row); // 复制当前行数据
  editDialogVisible.value = true;
};
// 打开编辑对话框
const openViewDialog = (row) => {
  Object.assign(detailRow, row); // 复制当前行数据
  viewDialogVisible.value = true;
};

// 保存编辑
const saveEdit = (updatedData) => {
  // 这里可以调用接口保存数据
  // Object.assign(detailRow, updatedData); // 更新父组件中的数据
  // ElMessage.success(`修改成功：${detailRow.customerName}`);
  // editDialogVisible.value = false;
  //  需要执行刷新
};

// 关闭对话框
const closeDialogEdit = () => {
  editDialogVisible.value = false;
};
// 关闭对话框
const closeDialogView = () => {
  viewDialogVisible.value = false;
};
// 关闭对话框
const closeDialogAdd = () => {
  addDialogVisible.value = false;
};

// const handleEdit = (row: any) => {
//   alert("UNSURENESSS");
//   // router.push(`${props.editUrl}/${row.id}`)
// }

/*view*/
const handleAdd = () => {
  addDialogVisible.value = true;
}
/*view*/
const handleView = () => {
  // count.value++
  // ElMessage.success(`按钮被点击了 次`)
  // if (TableComt.currentRow.value) {
  //   ElMessage.success(`选中行数据：${JSON.stringify(currentRow.value)}`);
  // } else {
  //   ElMessage.warning("未选中任何行");
  // }
  // if (tableComtRef.value?.currentRow) {
  //   ElMessage.success("通过 ref 获取选中行:", tableComtRef.value.currentRow)
  // } else {
  //   ElMessage.success(`未选中任何行`)
  // }
  // console.log(tableComtRef.value);
  // console.log(tableComtRef.value.currentRow);
  // if (tableComtRef.value?.currentRow) {
  //   // console.log("选中的行数据:", tableComtRef.value.currentRow);
  //     ElMessage({type: 'success', message: `tableComtRef.value.currentRow.customerName`, style: 'z-index: 3000;'});
  //     ElMessage({type: 'success', message: tableComtRef.value.currentRow.customerName, style: 'z-index: 3000;'});
  //     // ElMessage.success(tableComtRef.value.currentRow.customerName)
  //   // ElMessage.success(`选中的客户名：${tableComtRef.value.currentRow.customerName}`)
  //
  //   Object.assign(detailRow, tableComtRef.value.currentRow); // 复制当前行数据
    viewDialogVisible.value = true;
  // } else {
  //   console.log("未选中任何行");
  //   ElMessage({type: 'success', message: '未选中任何行', style: 'z-index: 3000;'});
  // }
}

/*Update*/
const handleEdit = () => {
  // count.value++
  // ElMessage.success(`按钮被点击了 次`)
  // if (TableComt.currentRow.value) {
  //   ElMessage.success(`选中行数据：${JSON.stringify(currentRow.value)}`);
  // } else {
  //   ElMessage.warning("未选中任何行");
  // }
  // if (tableComtRef.value?.currentRow) {
  //   ElMessage.success("通过 ref 获取选中行:", tableComtRef.value.currentRow)
  // } else {
  //   ElMessage.success(`未选中任何行`)
  // }
  // console.log(tableComtRef.value);
  // console.log(tableComtRef.value.currentRow);
  if (tableComtRef.value?.currentRow) {
    // console.log("选中的行数据:", tableComtRef.value.currentRow);
      ElMessage({type: 'success', message: `tableComtRef.value.currentRow.customerName`, style: 'z-index: 3000;'});
      ElMessage({type: 'success', message: tableComtRef.value.currentRow.customerName, style: 'z-index: 3000;'});
      // ElMessage.success(tableComtRef.value.currentRow.customerName)
    // ElMessage.success(`选中的客户名：${tableComtRef.value.currentRow.customerName}`)

    Object.assign(detailRow, tableComtRef.value.currentRow); // 复制当前行数据
    editDialogVisible.value = true;
  } else {
    console.log("レコードが選択されていません。");
    ElMessage({type: 'success', message: 'レコードが選択されていません。', style: 'z-index: 3000;'});
  }
}
/*delete*/
const handleDel = async () => {
  if (tableComtRef.value?.currentRow) {
    // console.log("选中的行数据:", tableComtRef.value.currentRow);
    //   ElMessage.success(`tableComtRef.value.currentRow.customerName`)
    //   ElMessage.success(tableComtRef.value.currentRow.customerName)
      // ElMessage.success(tableComtRef.value.currentRow.customerName)
    // ElMessage.success(`选中的客户名：${tableComtRef.value.currentRow.customerName}`)

    // Object.assign(detailRow, tableComtRef.value.currentRow); // 复制当前行数据
    // editDialogVisible.value = true;
    // debugger

    try {
      loadingDel.value=true;

      /*ElMessage.success(tableComtRef.value.currentRow.id)
      const tableResponse = axios.delete(delUrl.value, {
        params: {
          id: tableComtRef.value.currentRow.id,
        }
      });*/

      const tableResponse = await useNuxtApp().$api(delUrl.value, {
        method: 'DELETE',
        params: {
          id: tableComtRef.value.currentRow.id,
        }
      });

      /*const handleDel = () => {
        useNuxtApp().$api(delUrl.value, {
          method: 'DELETE',
          params: { id: tableComtRef.value.currentRow.id },
        })
            .then((response) => {
              console.log("删除成功", response);
              ElMessage({type: 'success', message: '削除が完了しました。', style: 'z-index: 3000;'});
            })
            .catch((error) => {
              console.error("删除失败", error);
              ElMessage({type: 'warning', message: 'ファイルIDが存在しません', style: 'z-index: 3000;'});
            });
      };*/

      // const tableResponse = await useNuxtApp().$api(delUrl, {
      //   method: 'POST',
      //   body: {
      //     page: '111'
      //   }
      // });

    } catch (error) {
      ElMessage({type: 'error', message: 'データの取得に失敗しました。', style: 'z-index: 3000;'});
    } finally {
      // loading.close(); // 无论成功与否都关闭加载动画
      loadingDel.value=false;
    }
  } else {
    console.log("レコードが選択されていません。");
    ElMessage({type: 'success', message: 'レコードが選択されていません。', style: 'z-index: 3000;'});
  }
}


</script>
<style scoped>
.result-paging {
  border-radius: 4px;
  align-items: center;
  margin-top: 3px;
}
.mb-4 {
  margin-bottom: 8px;
  display: inline;
}
::v-deep(.el-card__body) {
  height: 100%;
}
</style>