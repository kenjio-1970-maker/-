<template>
  <div>
    <el-page-header @back="goBack">
      <template #content>
        <span class="text-large font-600 mr-3">客户基本信息管理</span>
      </template>
      <template #extra>
        <div class="flex items-center">
          <el-button type="primary" class="ml-2 new-add-button" @click="handleAdd">新规作成</el-button>
        </div>
      </template>
    </el-page-header>


    <!-- <SearchComponent :searchFields="searchFields" :searchUrl="'/cusBase'" @search="handleSearch" /> -->
    <TableComponent :tableColumns="tableColumns" :tableUrl="'/cusBase'" :viewUrl="'/cusBase/view'" :editUrl="'/cusBase/edit'" :deleteUrl="'/cusBase'" />
  <!-- 移除弃用属性 background -->
<el-pagination layout="prev, pager, next" :total="1000" /> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import SearchComponent from '~/components/SearchComponent.vue'
import TableComponent from '~/pages/test/TableComponent.vue'

const router = useRouter()

const goBack = () => {
  router.back()
}

// 搜索表单数据
const searchForm = reactive({
  customerName: '',
  phone: '',
  address: ''
})

// 表格数据
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

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

// 搜索方法
const handleSearch = async (response) => {
  tableData.value = response
}

// 新增方法
const handleAdd = () => {
  router.push('/cusBase/add')
}

// 查看方法
const handleView = (row: any) => {
  router.push(`/cusBase/view/${row.id}`)
}

// 编辑方法
const handleEdit = (row: any) => {
  router.push(`/cusBase/edit/${row.id}`)
}

// 删除方法
const handleDelete = (row: any) => {
  ElMessageBox.confirm('この顧客情報を削除してもよろしいですか？', '通知', {
    confirmButtonText: '確認',
    type: 'warning'
  }).then(async () => {
    try {
      await useNuxtApp().$api(`/cusBase/${row.id}`, { 
        method: 'DELETE'
      })
      ElMessage.success('削除が完了しました')
      handleSearch()
    } catch (error) {
      ElMessage({type: 'error', message: 'この顧客情報を削除してもよろしいですか？', style: 'z-index: 3000;'});
    }
  })
}

// 初始化加载数据
// handleSearch()
</script>

<style scoped>

/*.search-result-card {*/
/*  margin: 20px;*/
/*  padding: 20px;*/
/*  border-radius: 10px;*/
/*  overflow: auto;*/
/*  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);*/
/*  height: 60vh;*/
/*}*/

.card-header {
  font-size: 18px;
  text-align: left;
}

.search-result-paging {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 40px;
}

.el-button {
  margin-top: 5px;
}
/* .search-card {
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: 15vh;
} */
.search-result-card {
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
  overflow: auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: 50vh;
}
.card-header {
  font-size: 18px;
  text-align: left;
}
.search-form {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
}
.search-action {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.search-result-paging {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 40px;
}
.el-button {
  margin-top: 5px;
}
.new-add-button {
  margin-right: 20px;
}
::v-deep(.el-card__body) {
  height: 100%;
}
</style>