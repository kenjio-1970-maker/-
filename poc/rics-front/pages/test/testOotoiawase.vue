<template>
  <div v-for="(pidDomain, index) in tableData" :key="index">
    <label :for="'input-' + pidDomain.id">{{ pidDomain.questionContent }}</label>
    <div v-for="(pidDomainSub, index) in pidDomain.children" :key="index">
      <label :for="'input-' + pidDomainSub.id">{{ pidDomainSub.questionContent }}</label>
      <input :type="pidDomainSub.questionType" :id="pidDomainSub.id" v-model="pidDomainSub.responseContent">
    </div>
  </div>
</template>

<script lang="ts" setup>
// 导入所需的Vue组件和工具库
import { ref } from 'vue'
import dayjs from 'dayjs'

// 获取当前日期
const now = new Date()

// 定义组件的属性
const props = defineProps({
  // 表格列配置数组
  tableColumns: { type: Array, required: true },
  // 获取表格数据的API地址
  tableUrl: { type: String, required: true },
})

// 暴露组件方法，允许父组件获取表格数据
defineExpose({
  getTableData: () => tableData.value
})

// 表格数据数组，使用ref使其具有响应性
const tableData = ref<TableData[]>([]);

/**
 * 删除指定索引的表格行
 * @param index 要删除的行索引
 */
const deleteRow = (index: number) => {
  tableData.value.splice(index, 1)
}

/**
 * 添加新的表格行
 * 新行会包含当前日期作为actionDate字段
 */
const onAddItem = () => {
  // 向表格数据中添加新行
  tableData.value.push({
    actionDate: dayjs(now).format('YYYY-MM-DD'), // 格式化日期为YYYY-MM-DD格式
  })
}

/**
 * 获取表格数据并显示加载动画
 * 通过API获取数据并更新表格
 */
const handleSearch = async () => {
  // 创建加载动画，指定作用目标为表格
  const loading = ElLoading.service({
    target: '.el-table'
  });

  try {
    // 调用API获取表格数据
    const tableResponse = await useNuxtApp().$api('/apl/inquiry/lisOtoiawase', {
      method: 'POST',
      body: {}
    });

    // 更新表格数据
    tableData.value = tableResponse;
  } catch (error) {
    // 错误处理：显示错误消息
    ElMessage({type: 'error', message: 'データの取得に失敗しました。', style: 'z-index: 3000;'});
  } finally {
    // 关闭加载动画
    loading.close();
  }
};

// 组件挂载时调用handleSearch获取初始数据
onMounted(() => {
  handleSearch();
});
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
</style>