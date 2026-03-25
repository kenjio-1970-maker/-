<template>
    <el-card class="search-card">
      <template #header>
        <div class="card-header"> <span>検索条件</span> </div>
      </template>
      <el-form label-width="auto" class="search-form">
        <el-form-item v-for="(field, index) in searchFields" :key="index" :label="field.label">
          <el-input v-model="searchForm[field.prop]" :placeholder="`请输入${field.label}`" :style="{ width: '240px' }" />
        </el-form-item>
      </el-form>
      <el-form class="search-action">
        <el-form-item>
          <el-button type="primary" @click="handleSearch">検索</el-button>
          <el-button @click="handleReset">クリア</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  <el-card class="search-result-card">
      <el-table :data="tableData" stripe border style="width: 100%" :default-sort="{prop: tableColumns[0].prop, order: 'ascending'}" @sort-change="handleSortChange" show-overflow-tooltip sticky @row-click="handleRowClick" :row-key="row => row.id" :highlight-current-row="true" :sortable="true" :fixed="true" height="400px">
        <el-table-column v-for="(column, index) in tableColumns" :key="index" :prop="column.prop" :label="column.label" :width="column.width" />
        <el-table-column label="操作" width="280">
          <!-- <template #default="scope"> -->
            <template #default="scope">
            <el-button type="info" @click="handleView(scope.row)" style="margin-left: 0px;">
              照会
            </el-button>
            <el-button type="primary" @click="handleEdit(scope.row)" style="margin-left: 10px;">
              編集
            </el-button>
            <el-button type="danger" @click="handleDelete(scope.row)" style="margin-left: 10px;">
              削除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="search-result-paging">
        <!-- :total="400" -->
        <!-- 假设新的用法，具体需根据 ElementPlus 文档调整 -->
<el-pagination
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[10, 50, 100, 500]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
      </div>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const props = defineProps({
  searchFields: { type: Array, required: true },
  searchUrl: { type: String, required: true },
  tableColumns: { type: Array, required: true },
  tableUrl: { type: String, required: true },
  viewUrl: { type: String, required: true },
  editUrl: { type: String, required: true },
  deleteUrl: { type: String, required: true }
})

const router = useRouter()

const searchForm = reactive({})

const emit = defineEmits(['search'])

const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedRow = ref(null)

const handleSearch = async () => {
  try {
    // const searchResponse = await useNuxtApp().$api(props.searchUrl, {
    //   method: 'POST', 
    //   body: {
    //     ...searchForm,
    //     page: 1,
    //     pageSize: 10
    //   }
    // });
    const tableResponse = await useNuxtApp().$api(props.tableUrl, {
      method: 'POST', 
      body: {
        page: currentPage.value,
        pageSize: pageSize.value
      }
    });
    tableData.value = tableResponse;
    // emit('search', searchResponse);
    // total.value = response.data.total :todo 分页
  } catch (error) {
    ElMessage.error('データの取得に失敗しました。');
  }
};

const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  handleSearch()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}

const handleView = (row: any) => {
  router.push(`${props.viewUrl}/${row.id}`)
}

const handleEdit = (row: any) => {
  router.push(`${props.editUrl}/${row.id}`)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('この顧客情報を削除してもよろしいでしょうか？', '通知', {
    confirmButtonText: '確認',
    cancelButtonText: 'キャンセル',
    type: 'warning'
  }).then(async () => {
    try {
      await useNuxtApp().$api(`${props.deleteUrl}/${row.id}`, { 
        method: 'DELETE'
      })
      ElMessage({type: 'success', message: '削除が完了しました。', style: 'z-index: 3000;'});
      handleSearch()
    } catch (error) {
      ElMessage({type: 'error', message: '削除に失敗しました。再度お試しください。', style: 'z-index: 3000;'});
    }
  })
}

const handleSortChange = async (sort: { prop: string; order: string | null }) => {
  if (sort.order) {
    const sortProp = sort.prop;
    const sortOrder = sort.order === 'ascending' ? 'asc' : 'desc';
    try {
      const response = await useNuxtApp().$api(props.tableUrl, { 
        method: 'POST', 
        body: { 
          page: currentPage.value, 
          pageSize: pageSize.value, 
          sortProp: sortProp, 
          sortOrder: sortOrder 
        }
      });
      tableData.value = response;
    } catch (error) {
      ElMessage.error('並べ替えに失敗しました。もう一度お試しください。');
    }
  }
}

const handleRowClick = (row) => {
  selectedRow.value = row
}

// 初始化加载数据
handleSearch()
</script>

<style scoped>
.search-card {
  margin: 20px;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: auto;
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

.el-button {
  margin-top: 5px;
}
/* .search-result-card {
  margin: 20px;
  padding: 20px;
  border-radius: 4px;
  overflow: auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: 60vh;
} */

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

</style>