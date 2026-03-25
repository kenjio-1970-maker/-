<template>
  <!-- stripe  v-loading="loadingFlag" -->
  <el-table
      :data="tableData"
      v-loading="loadingFlag"
      border  
      show-overflow-tooltip sticky
      :row-key="row => row.id"
      @row-click="handleRowClick"
      @row-dblclick="dblClickRow"
      @current-change="handleCurrentChange"
      :highlight-current-row="highlightCurRow"
      class="main-table-cls"
      :header-cell-style="headerCellStyle"
      :cell-style="{ textAlign: 'center' , padding: '5px 0px 5px 0px', fontSize: '12px' }"
  >
    <el-table-column
        v-for="(column, index) in tableColumns"
        :key="index"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        row-dblclick
        sortable 
        class="table-column-cls"
    >
      <!-- 判断是否传入 selectKey -->
      <template #default="{ row }">

        <SelectKeyFormatter
            v-if="column.selectKey"
            :selectKey="column.selectKey"
            :value="getCellValue(row, column.prop)"
            :key="$forceReload()"
        />
        
      <SelectKeyFormatterDate
            v-else-if="column.formatDate"
            :formatDate="column.formatDate"
            :value="getCellValue(row, column.prop)"
            :key="$forceReload()"
        />



        <!-- <span v-elseif="column.formatDate">
        <el-table-column
          prop="createTime"
          :formatter="formatDate" />
        </span> -->

        <span v-else>{{ getCellValue(row, column.prop) }}</span>
      </template>
    </el-table-column>

    <el-table-column prop="opt" label="操作" width="170px" fixed="right" v-if="isshowBtn">
      <template #default="scope">
<!--        <el-button type="primary" :icon="Edit" @click.prevent="editRow(scope.$index)" size="small">編集</el-button>-->
        <el-button type="primary" :icon="Edit" @click.prevent="editRow(scope.row)" size="small">編集</el-button>

<!--        <el-popconfirm title="このデータを削除してもよろしいですか？" confirm-button-text="はい" cancel-button-text="いいえ" @confirm.prevent="delRow(scope.$index)" width="320">-->
        <el-popconfirm title="このデータを削除してもよろしいですか？" confirm-button-text="はい" cancel-button-text="いいえ" @confirm.prevent="delRow(scope.row)" width="320">
          <template #reference>
            <el-button type="danger" :icon="Delete" size="small">削除</el-button>
          </template>
        </el-popconfirm>

        <!-- <el-button type="danger" :icon="Delete" @click.prevent="delRow(scope.$index)" size="small">削除</el-button> -->
      </template>
    </el-table-column>
  </el-table>

  <div class="page-pagination-block">
    <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[30, 50, 100]"
        :size="size"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageSumTotal"
        @size-change="handleSizeChangePage"
        @current-change="handleCurrentChangePage"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { ElMessage, ElTable, ElLoading, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import { ArrowLeft, ArrowRight, Delete, Edit, Share, Plus, View, Select } from "@element-plus/icons-vue";
import SelectKeyFormatter from "@/components/ElxColumnSelectKey.vue";
import SelectKeyFormatterDate from "@/components/ElxColumnSelectKeyDate.vue";
import "@/assets/css/components/table.css";

const currentRow = ref(null);/*CurrentSelectedLine*/
const loadingFlag = ref(true);/*TableLoadingState*/
const singleTableRef = ref<InstanceType<typeof ElTable>>();

const router = useRouter()
const tableData = ref([])


const props = defineProps({
  searchData: { type: [Array, Object], required: false, default: () => ({}) }, // 设置默认值为空对象
  searchUrl: { type: String, required: true },
  tableColumns: { type: Array, required: true, width: false, selectKey: false, formatDate: false },
  tableUrl: { type: String, required: true },
  viewUrl: { type: String, required: true },
  editUrl: { type: String, required: false },
  deleteUrl: { type: String, required: false },
  saveUrl: { type: String, required: false },
  highlightCurRow: { type: Boolean, default: false },
  isshowBtn: { type: Boolean, required: false, default: true },
});

const confirmEvent = () => {
  alert('Are you sure to delete this?');
}

// 解析嵌套路径的函数
const getCellValue = (row, prop) => {
  if (!prop) return '';
  return prop.split('.').reduce((acc, key) => acc && acc[key], row) || '';
};

// 定义刷新方法
const refresh = async () => {
  console.log('Refreshing table data...');
  await handleSearch(); // 调用已有的搜索逻辑刷新表格数据
};

defineExpose({
  currentRow,
  refresh, // 确保暴露了 refresh 方法
});

const handleCurrentChange = (row) => {
  currentRow.value = row;
};


const formatDate = (cellValue) =>  {
    return cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm') : '-';
}

const handleSearch = async () => {
  // 开始加载时设置 loadingFlag 为 true
  loadingFlag.value = true;
  const loading = ElLoading.service({
    target: '.el-table',
  });
  try {
    const tableResponse = await useNuxtApp().$api(props.tableUrl, {
      method: 'POST',
      body: {
        data: {
          ...props.searchData
        },
        page: currentPage.value,
        pageSize: pageSize.value,
      },
    });

    if (tableResponse.fail) {
        // 无权限用户
        if(useRoute().path === '/apl/aplInquiryMgntList'){
            return ;
        }
        ElMessage.error(tableResponse.msg);
        return;
    }

    tableData.value = tableResponse.data.records;
    currentPage.value = tableResponse.data.current;
    pageSize.value = tableResponse.data.size;
    pageSum.value = tableResponse.data.size;
    pageSumTotal.value = tableResponse.data.total;

  } catch (error) {
    ElMessage.error('データの取得に失敗しました。');
  } finally {
    // 加载完成后关闭 loading
    loading.close();
    loadingFlag.value = false;
  }
};

// 组件挂载时调用 handleSearch 获取初始数据
// onMounted(() => {
//   handleSearch(); // 初始化加载表格数据
// });

// 监听 props.searchData 的变化
// watch(() => props.searchData, () => {
//   handleSearch(); // 当搜索数据变化时，刷新表格
// }, { deep: true });

const loadingFun = () => {
  loadingFlag.value = false;
};

/*分页开始*/
const currentPage = ref(1);/*当前页*/
const pageSize = ref(50);/*每页数量*/
const pageSum = ref(1);/*总页数*/
const pageSumTotal = ref(0);/*数据量*/

const handleCurrentChangePage = (val: number) => {
  currentPage.value = val;
  handleSearch();
};

const handleSizeChangePage = (val: number) => {
  pageSize.value = val;
  handleSearch();
};
/*分页结束*/

const emit = defineEmits(['select-row', 'row-selected', 'edit-row', 'del-row', 'dbl-click-row', 'row-click']); // 定义事件

const handleRowClick = (row) => {
  emit('row-click', row);
};

const editRow = (row: RowType) => {
  emit('edit-row', row);
};
// const editRow = (index: number) => {
//   emit('edit-row', tableData.value[index]);
// };

const delRow = (row: RowType) => {
  emit('del-row', row);
};
// const delRow = (index: number) => {
//   emit('del-row', tableData.value[index]);
// };

const dblClickRow = (row, column, event) => {
  // 弹出列表, 不触发双击
  if(! props.isshowBtn){
    return ;
  }
  emit('dbl-click-row', row);
};

// 表头样式
const headerCellStyle = {
  background: '#4297D7',
  color: '#F5F5DC',
  textAlign: 'center',
  padding: '3px 0px',
};
</script>

<style scoped>
/* 表格与上方按钮间隔 */
.el-table {
  margin-top: 8px;
}

/* 分页模块与表格间隔 */
.page-pagination-block {
  padding-top: 10px;
}
</style>
