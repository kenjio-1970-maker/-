<template>
  <el-form-item label="业务编号">
    <el-input v-model="businessId" :disabled="true" />
  </el-form-item>

  <el-form-item label="其他编号">
    <el-input v-model="otherId" />
  </el-form-item>

  <el-form-item label="PC情報のスクショ" prop="pcScreenshotList">
    <!--
      FileUpload组件：用于上传PC信息的截图
      v-model:file-list：双向绑定文件列表到pcScreenshotListArray计算属性
      disabled：根据isReadOnly属性禁用上传功能
      upload-url：上传文件的API端点
      extra-form-data：与文件一起上传的额外表单数据，包含workerId
      preview-url：预览已上传文件的URL前缀
      limit：限制上传的文件数量
      max-size-m-b：限制上传的单个文件的大小，单位是MB
      enable-global-drop：启用全局拖拽上传功能
      :upload-url="'/sys/user/worker/screenshot'"
      :extra-form-data="[{ key: 'fileType', value: 'workerScreenshot' }]"
    -->
    <FileUpload
      :disabled="isReadOnly"
      bizNo="123123"
      fileType="workerScreenshot"
      :preview-url="'download'" 
      :limit="5"
      :max-size-m-b="10"
      :enableGlobalDrop="true" />
  </el-form-item>
</template>

<script lang="ts" setup>
// import { defineProps, defineEmits, computed, ref } from 'vue';
// import type { UploadUserFile, UploadStatus } from 'element-plus'

// const props = defineProps({
//   modelValue: {
//     type: Object,
//     required: true
//   },
//   isReadOnly: {
//     type: Boolean,
//     default: false
//   }
// });

// 写死的业务编号
const businessId = ref('RIC2024001');
// 其他编号
const otherId = ref('');
</script>
