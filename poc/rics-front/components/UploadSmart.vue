<template>
  <div v-loading="loading" element-loading-text="処理中..." class="upload-container">
    <el-upload
      class="upload-demo"
      drag
      :http-request="customUpload"
      :limit="2"
      :before-upload="beforeUpload"
      :on-change="handleFileChange"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        ファイルをここにドラッグするか、<em>クリックしてアップロード</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          PDFファイルのみ対応
        </div>
      </template>
    </el-upload>
    <el-popconfirm 
      v-if="props.sendMod === '2'" 
      title="当該問い合わせは郵送を希望しています。メールで送信してもよろしいでしょうか。" 
      confirm-button-text="はい" 
      cancel-button-text="キャンセル" 
      :popper-options="{ placement: 'top' }" 
      popper-class="wide-popper horizontal-buttons" 
      @confirm="handleConfirm" 
      @cancel="handleCancel"
    >
      <template #reference>
        <el-button 
          type="primary" 
          style="margin-top: 10px; width: 100%;" 
          :disabled="!uploadSuccess"
        >
          送信
        </el-button>
      </template>
    </el-popconfirm>
    <el-button 
      v-else 
      type="primary" 
      style="margin-top: 10px; width: 100%;" 
      :disabled="!uploadSuccess" 
      @click="handleConfirm"
    >
      送信
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue';
import { defineEmits, defineProps, ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const emit = defineEmits(['file-uploaded']);

// 接收 bizNo 和 bizType 属性
const props = defineProps({
  bizNo: {
    type: String,
    required: true,
  },
  bizType: {
    type: String,
    required: true,
  },
  sendMod: {
    type: String,
    required: true,
  },
});

const uploadSuccess = ref(false); // 标记上传是否成功
let uploadedFile = null; // 存储上传成功的文件信息
const loading = ref(false); // 确保 loading 是响应式变量

// 页面加载完成后打印 sendMod 的值
onMounted(() => {
  console.log('页面加载完成，sendMod 的值:', props.sendMod);
});

// 检查是否允许上传文件
const beforeUpload = () => {
  if (uploadedFile) {
    ElMessage({ type: 'warning', message: '既にファイルがアップロードされています。削除してから再度アップロードしてください。', style: 'z-index: 3000;' }); // 提示用户
    return false; // 阻止上传
  }
  return true; // 允许上传
};

// 自定义上传逻辑
const customUpload = async (options: any) => {
  const { file, onSuccess, onError } = options;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('bizNo', props.bizNo); // 添加 bizNo
  formData.append('fileType', props.bizType); // 添加 bizType

  try {
    const res = await useNuxtApp().$api('/sys/file/mgnt/upload', {
      method: 'POST',
      body: formData,
    }) as any;

    console.log('ファイルアップロードの応答:', res); // 打印完整的响应数据

    if (res && res.success) {
      console.log('ファイルアップロード成功:', res);
      onSuccess(res); // 通知 el-upload 上传成功
      uploadSuccess.value = true; // 标记上传成功
      uploadedFile = res; // 保存上传成功的文件信息
    } else {
      const errorMessage = res?.msg || '不明なエラー';
      console.error('ファイルアップロード失敗:', errorMessage);
      ElMessage({ type: 'error', message: errorMessage, style: 'z-index: 3000;' }); // 使用 ElMessage 展示错误信息
      onError(new Error(errorMessage)); // 通知 el-upload 上传失败
      uploadSuccess.value = false; // 标记上传失败
    }
  } catch (error) {
    console.error('ファイルアップロード中にエラーが発生しました:', error);
    ElMessage({ type: 'error', message: 'ファイルアップロード中にエラーが発生しました', style: 'z-index: 3000;' }); // 使用 ElMessage 展示错误信息
    onError(error); // 通知 el-upload 上传失败
    uploadSuccess.value = false; // 标记上传失败
  }
};

// 监听文件变化，确保只能上传一个文件
const handleFileChange = (fileList: any) => {
  if (fileList.length > 1) {
    fileList.splice(0, fileList.length - 1); // 保留最新的文件，移除其他文件
    console.log('已覆盖之前的文件，仅保留最新上传的文件');
  }
};

// 通知父组件上传成功
const notifyParent = () => {

  
  if (uploadedFile) {
    emit('file-uploaded', uploadedFile); // 通知父组件
    console.log('通知父组件上传成功:', uploadedFile);
  }
};

// 用户取消发送操作
const handleCancel = () => {
  console.log('用户取消了发送操作');
};

// 确认发送逻辑
const handleConfirm = async () => {
  loading.value = true; // 开启加载状态
  try {
    notifyParent(); // 通知父组件
    await new Promise(resolve => setTimeout(resolve, 9000)); // 固定等待 9 秒
    ElMessage({ type: 'success', message: '送信が成功しました', style: 'z-index: 3000;' });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    ElMessage({ type: 'error', message: 'エラーが発生しました', style: 'z-index: 3000;' });
  } finally {
    loading.value = false; // 关闭加载状态
  }
};
</script>

<style scoped>
/* 自定义弹出框宽度 */
.wide-popper {
  width: 300px; /* 设置宽度为 300px，可根据需要调整 */
}

/* 确认框按钮左右并列展示 */
.horizontal-buttons .el-popconfirm__action {
  display: flex;
  justify-content: space-between; /* 确保按钮左右对齐 */
  gap: 10px; /* 按钮之间的间距 */
}

.horizontal-buttons .el-popconfirm__action .el-button {
  flex: 1; /* 确保按钮宽度一致 */
  text-align: center;
}

/* 添加加载效果的容器样式 */
.upload-container {
  position: relative;
}
</style>
