<template>
  <!-- style="max-width: 600px" -->
    <el-form
      :label-position="labelPosition"
      label-width="100%"
      :model="formLabelAlign"
      style="width: 100%"
      v-loading="loading"
    >

    <div v-for="(pidItem, index) in tableData" :key="index" style="width: 70%">
      <!-- <span style="font-size: 20px; font-weight: bold; color: rgb(122 83 235);">{{pidItem.questionContent}}</span> -->
       <div class="el-card__header" v-if="pidItem.id != '200003'" style="margin-left: -20px;margin-bottom: 20px; width:150%" ><span class="card-header">{{ pidItem.questionContent }} </span></div>

        <el-form-item v-for="(item, index) in pidItem.children" :key="index" :label="`${item.questionMark} ${item.questionContent}`" :label-position="itemLabelPosition" :disabled="isReadOnly">
          <el-input v-if="item.questionType === 'text'" v-model="item.questionResContent" style="width: 70%" :disabled="isReadOnly"/>
          <el-input v-if="item.questionType === 'textarea'" v-model="item.questionResContent" autosize type="textarea" :disabled="isReadOnly"/>
          <elx-radio-group v-if="item.questionType === 'radio'" v-model="item.questionResContent" :selectKey="item.optionVal" :groupName="item.questionMark" :disabled="isReadOnly"></elx-radio-group>
          <elx-radio-group v-if="item.questionType === 'radioUpright'" v-model="item.questionResContent" :selectKey="item.optionVal" :groupName="item.questionMark" styleLine="block"  :disabled="isReadOnly"></elx-radio-group>
          <elx-tree-select v-if="item.questionType === 'tree'" v-model="item.questionResContent" :selectKey="item.optionVal" :disabled="isReadOnly"></elx-tree-select>
          <elx-checkbox-group v-if="item.questionType === 'checkbox'" v-model="item.questionResContent" :selectKey="item.optionVal" :groupName="item.questionMark" :disabled="isReadOnly"></elx-checkbox-group>
          <elx-checkbox-group v-if="item.questionType === 'checkboxUpright'" v-model="item.questionResContent" :selectKey="item.optionVal" :groupName="item.questionMark" styleLine="block" :disabled="isReadOnly"></elx-checkbox-group>
          <elx-select v-if="item.questionType === 'select'" v-model="item.questionResContent" :selectKey="item.optionVal" style="width: 70%" :disabled="isReadOnly"/>
          <el-date-picker v-if="item.questionType === 'date'" v-model="item.questionResContent" type="date" aria-label="Pick a date" style="width: 70%" :disabled="isReadOnly"/>
          <el-time-picker v-if="item.questionType === 'time'" v-model="item.questionResContent" aria-label="Pick a time" style="width: 70%" :disabled="isReadOnly"/>
        </el-form-item>
    </div>

    </el-form>
</template>
  
<script lang="ts" setup>
import { reactive, ref, defineExpose } from 'vue'
import type { FormProps, FormInstance } from 'element-plus'

const labelPosition = ref<FormProps['labelPosition']>('top')
const itemLabelPosition = ref<FormProps['labelPosition']>('top')
const loading = ref(false)

// 表格数据数组，使用ref使其具有响应性
const tableData = ref<TableData[]>([]);
// let inquiryId = ref();

// 定义组件的属性
const props = defineProps({
  // 表格列配置数组
  // tableColumns: { type: Array, required: true },
  // 获取表格数据的API地址
  lisOtoiawaseUrl: { type: String, required: true },
  inquiryId: { type: String, required: false },
  isReadOnly: { type: Boolean, required: false, default: false },
})

// 暴露组件方法，允许父组件获取表格数据
defineExpose({
  getTableData: () => tableData.value
})

interface FormData {
  name: string
  region: string
  type: string
}

const formLabelAlign = reactive<FormData>({
  name: '',
  region: '',
  type: ''
})


/**
 * 获取表格数据并显示加载动画
 * 通过API获取数据并更新表格
 */
 const handleSearch = async () => {
  // 创建加载动画，指定作用目标为表格
  // const loading = ElLoading.service({
  //   target: '.el-table'
  // });
  try {
    // debugger
    loading.value=true;
    console.log(props.inquiryId);
    // 调用API获取表格数据
    const tableResponse = await useNuxtApp().$api(props.lisOtoiawaseUrl, {
      method: 'POST',
      body: {
        inquiryId: props.inquiryId
      }
    });

    // 更新表格数据
    tableData.value = tableResponse;
  } catch (error) {
    // 错误处理：显示错误消息
    ElMessage({
      type: 'error',
      message: 'データの取得に失敗しました',
      style: 'z-index: 3000;'
    });
  } finally{
    loading.value=false;
  }
};

// 组件挂载时调用handleSearch获取初始数据
onMounted(() => {
  handleSearch();
});
</script>
  