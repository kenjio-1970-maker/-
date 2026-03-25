<template>
  <!-- 动态表格组件，用于展示和编辑数据 -->
  <!--  引用操作手册:-->
  <!--  import TableAddDoc from '@/components/TableCommAddDoc.vue'-->
  <!--  <TableAddDoc-->
  <!--      :tableColumns="addDocTableColumns" 列字段列表-->
  <!--      bizDataType="apl"  操作类型(外键关联可不传)-->
  <!--      :bizDataNo="detailRow.id"  业务编号(必须)-->
  <!--      :isReadOnly="isReadOnly"  是否只读: 置灰所有操作按钮-->
  <!--      :key="$forceReload()"   随机key(必须)-->
  <!--      ref="tableComtRefAddDoc"/>-->
  <!--  </div>-->
  <!-- max-height="250" width="150" -->
  <el-table :data="tableData" style="width: 100%" v-loading="loading">
    <!-- 序号列，固定在左侧 -->
    <el-table-column v-if="!hideIndex" fixed type="index" label="No" width="60" header-align="center" align="center" />
    <!-- 动态生成表格列，根据addDocTableColumns配置生成对应的输入框列 -->
    <el-table-column 
      v-for="(column, index) in tableColumns" 
      :key="index"  
      :prop="column.prop" 
      :label="column.label" 
      :width="column.width" 
      header-align="center" 
      align="center"
    >
      <template #default="scope">
        <!-- 根据行的 isReadOnly 字段动态设置 :disabled -->
        <el-input 
          v-if="column.inTyp === 'text'" 
          v-model="scope.row[column.prop]" 
          size="medium" 
          class="full-width-input" 
          style="width: 100%" 
          :disabled="isReadOnly || scope.row.isReadOnly" 
        />
        <el-input v-if="column.inTyp === 'textarea'" v-model="scope.row[column.prop]" size="medium" autosize type="textarea" class="full-width-input" :disabled="isReadOnly" />
        <el-input v-if="column.inTyp === 'number'" v-model.number="scope.row[column.prop]" size="medium" class="full-width-input" :disabled="isReadOnly"/>
        <el-input v-if="column.inTyp === 'money'" v-model.number="scope.row[column.prop]" size="medium" :formatter="formatMoney" :parser="parseMoney" class="full-width-input"  :disabled="isReadOnly" />
        <elx-select 
          v-if="column.inTyp === 'select'" 
          v-model="scope.row[column.prop]" 
          :disabled="isReadOnly || scope.row.isReadOnly" 
          :selectKey="typeof column.selectKey === 'function' ? column.selectKey(scope.row) : column.selectKey" 
          :selectUrl="column.selectUrl"  
          :keyName="column.keyName" 
          :labelName="column.labelName" 
          style="width: 100%" 
        />
        <el-date-picker v-if="column.inTyp === 'date'" v-model="scope.row[column.prop]" size="medium" type="date" aria-label="Pick a date" style="width: 100%" :disabled="isReadOnly" />
        <el-time-picker v-if="column.inTyp === 'time'" v-model="scope.row[column.prop]" size="medium" aria-label="Pick a time" style="width: 100%" :disabled="isReadOnly" />
      </template>
    </el-table-column>

    <!-- 操作列，固定在右侧 -->
    <el-table-column v-if="!hideOperations" fixed="right" min-width="40" max-width="80" header-align="center" align="center">
      <template #default="scope">
        <!-- 删除按钮，点击后删除对应行 -->
        <el-button link type="primary" class="table-add-doc-btn-css" size="medium" @click.prevent="deleteRow(scope.$index)" :disabled="isReadOnly">
          削除
        </el-button>
      </template>
    </el-table-column>
    <el-table-column v-if="!hideOperations && fixBtn1" fixed="right" min-width="40" max-width="80" header-align="center" align="center">
      <template #default="scope">
        <!-- 自定义按钮1 -->
        <el-button link type="primary" class="table-add-doc-btn-css" size="medium" @click.prevent="fixBtn1Handler(scope.$index)" :disabled="fixBtn1IsReadOnly">
          {{ fixBtn1 }}
        </el-button>
      </template>
    </el-table-column>
    <el-table-column v-if="!hideOperations && fixBtn2" fixed="right" min-width="40" max-width="80" header-align="center" align="center">
      <template #default="scope">
        <!-- 自定义按钮2 -->
        <el-button link type="primary" class="table-add-doc-btn-css" size="medium" @click.prevent="fixBtn2Handler(scope.$index)" :disabled="fixBtn2IsReadOnly">
          {{ fixBtn2 }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 添加新行按钮 -->
  <el-button v-if="!hideAddButton" class="mt-4" style="width: 100%" @click="onAddItem" :disabled="isReadOnly" >
    <span style="font-weight: bold; color: #888; font-size: 20px; 
            display: inline-block; text-align: center;
            line-height: 1; ">
  ＋
</span>
  </el-button>
</template>

<script lang="ts" setup>
// 导入所需的Vue组件和工具库
import { ref } from 'vue'
import dayjs from 'dayjs'
import { ElMessage, ElTable, ElLoading } from 'element-plus';

const taiouUrlDef = ref("/biz/progress/history/list");
//const finalUrl = computed(() => taiouUrlDef.value != null ? taiouUrlDef.value : props.tableUrl);
const finalUrl = computed(() => props.tableUrl != null ? props.tableUrl : taiouUrlDef.value);

// 获取当前日期
const now = new Date()
const loading = ref(false);/*TableLoadingState*/

// 定义组件的属性
const props = defineProps({
  tableColumns: { type: Array, required: true },
  tableUrl: { type: String, required: false },
  tableDataVal: { type: Array, required: false},
  bizDataType: { type: String, required: false },
  bizDataNo: { type: String, required: false },
  isReadOnly: { type: Boolean, required: false, default: false },
  hideOperations: { type: Boolean, required: false, default: false },
  hideAddButton: { type: Boolean, required: false, default: false },
  hideIndex: { type: Boolean, required: false, default: false },
  isLoadUrl: { type: Boolean, required: false, default: true },
  fixBtn1: { type: String, required: false },
  fixBtn1IsReadOnly: { type: Boolean, required: false },
  fixBtn2: { type: String, required: false },
  fixBtn2IsReadOnly: { type: Boolean, required: false },
})

// 暴露组件方法，允许父组件获取表格数据
defineExpose({
  getTableData: () => tableData.value
})

// 表格数据数组，使用ref使其具有响应性
let tableData = ref<any[]>([]);

/**
 * 删除指定索引的表格行
 * @param index 要删除的行索引
 */
const deleteRow = (index: number) => {
  tableData.value.splice(index, 1)
}

/**
 * 添加新的表格行
 * 新行会包含 isReadOnly 字段，默认为 false
 */
const onAddItem = () => {
  if (!tableData.value) {
    tableData.value = [];
  }
  tableData.value.push({ deliveryMod: '9', isReadOnly: false }); // 默认新行可编辑
};

/**
 * 设置某一行只读
 * @param index 要设置只读的行索引
 */
const setRowReadOnly = (index: number) => {
  if (tableData.value[index]) {
    tableData.value[index].isReadOnly = true; // 设置该行只读
  }
};

/**
 * 获取表格数据并显示加载动画
 * 通过API获取数据并更新表格
 * 2025-03-26 数据从父组件传入, 不再实时查询
 */
const handleSearch = async () => {
  loading.value = true;
  try {
    // 调用API获取表格数据
    console.log("finalUrl.value: ", finalUrl.value);
    if (!finalUrl || finalUrl  === '') {
      // finalUrl 不存在 或者是空字符串
      return ;
    }
    const tableResponse = await useNuxtApp().$api(finalUrl.value, {
      method: 'POST',
      body: {
        bizType: props.bizDataType,
        bizNo: props.bizDataNo,
      }
    });

    // 更新表格数据
    tableData.value = tableResponse.data;
  } catch (error) {
    ElMessage({ type: 'error', message: 'データの取得に失敗しました。', style: 'z-index: 3000;' });
    console.log(error);
  } finally {
    loading.value = false;
  }
};

// 组件挂载时初始化数据
onMounted(() => {
  if (props.tableDataVal) {
    tableData.value = props.tableDataVal;
  } else {// 临时  等待测试 :todo 
    handleSearch();
  }
});

const formatMoney = (value: number) => {
  if (!value) return '¥0';
  return `¥${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const parseMoney = (value: string) => {
  if (!value) return '';
  return value.replace(/¥\s?|(,*)/g, '');
};

// Define the emit event
const emit = defineEmits(['fixBtn1', 'fixBtn2']);

// 自定义按钮1
const fixBtn1Handler = (index: number) => {
  emit('fixBtn1', index);
};

// 自定义按钮2处理逻辑
const fixBtn2Handler = (index: number) => {
  emit('fixBtn2', index);
};
</script>

<style scoped>
/* 自定义输入框样式 */
.full-width-input :deep(.el-input__wrapper) {
  width: 100%;
  margin: 0;
  padding: 0;
  box-shadow: none;
}

/* 输入框内部样式调整 */
.full-width-input :deep(.el-input__inner) {
  width: 100%;
  border: none;
  padding: 4px 8px;
}

/* 表格宽度调整 */
:deep(.el-table__body) {
  width: 100% !important;
}

:deep(.el-table__header) {
  width: 100% !important;
}
.table-add-doc-btn-css {
  padding-left: 0px;
}
</style>