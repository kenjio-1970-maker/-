<template>
  <div :class="['upload-wrapper', { 'fullscreen-drag': enableGlobalDrop }]">
    <!-- fullscreen backdrop -->
    <div v-if="isDragging && enableGlobalDrop" class="drag-overlay" @dragover.prevent>
      <!-- 這個 div 用來擋掉事件，防止 el-upload 重複觸發 -->
      <div class="drag-catcher" @drop.stop.prevent="globalDropHandler"></div>
      <div class="drag-overlay-text">ここにファイルをドロップ</div>
    </div>

    <el-upload ref="uploadRef" drag :file-list="fileListRef" :http-request="customUploadRequest" :disabled="disabled"
      :limit="limit" :before-upload="beforeUpload" :on-error="handleError"
      :on-preview="handlePreview" :on-remove="handleRemove" class="upload-area">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        ファイルをドラッグしてここにドロップ、またはクリックしてアップロード
      </div>
      <template #tip>
        <div class="el-upload__tip">
          サイズは{{ maxSizeMB }}MB以下、最大{{ limit }}ファイルまでアップロード可能です。
        </div>
      </template>
      <!-- 錯誤訊息顯示區 -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </el-upload>
      <!-- 帐票预览对话框 -->
      <el-dialog v-model="viewFileFlag" title="プレビュー" width="80%">
        <!-- <PdfViewer fileId="FL1925010812930494464" /> -->
        <PdfEmbedVierwer :fileId="viewFileId" :key="$forceReload()"/>
      </el-dialog>

  </div>
  <!-- 显示文件编号 -->
  <!-- <div v-for="(file, index) in fileListRef" :key="file.uid">
    文件 {{ index + 1 }}: {{ file.fileId }}
  </div> -->
  <!-- PDF操作确认对话框 -->
  <el-dialog v-model="pdfOperationDialogVisible" title="PDFファイル操作" width="400px" :z-index="3000" :close-on-click-modal="false" :show-close="true" @closed="handleDialogClosed">
    <div style="text-align: center; margin-bottom: 10px;">どの操作を行いますか？</div>
    <template #footer>
      <div class="dialog-footer" style="display: flex; justify-content: center; gap: 20px;">
        <el-button @click="handlePdfDownload" size="large">ダウンロード</el-button>
        <el-button type="primary" @click="handlePdfPreview" size="large">プレビュー</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, defineProps } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import type { UploadUserFile, UploadStatus } from 'element-plus'
import PdfEmbedVierwer from '@/components/PdfEmbedViewer.vue'

const viewFileId = ref(''); // 用于存储要预览的 PDF 文件 ID
const viewFileFlag = ref(false); // 用于存储要预览的 PDF 文件 ID
const pdfOperationDialogVisible = ref(false); // PDF操作对话框显示标志
const downFilePdfName = ref(''); // PDF操作对话框显示标志
const currentFileForAction = ref<UploadUserFile | null>(null); // 当前操作的文件

const props = defineProps<{
  disabled?: boolean
  limit?: number
  maxSizeMB?: number
  enableGlobalDrop?: boolean
  bizNo: string // 业务编号
  fileType: string // 业务类型
  isPreview?: boolean // 是否支持预览
}>()

const uploadRef = ref()
const fileListRef = ref<MyUploadUserFile[]>([])

const isDragging = ref(false)
const isUploading = ref(false)
const errorMessage = ref('')
let dragCounter = 0

const limit = props.limit ?? 5
const maxSizeMB = props.maxSizeMB ?? 10

// 默认上传链接
const defaultUploadUrl = {
  list: '/sys/file/mgnt/list', // 查询列表
  delete: '/sys/file/mgnt/delete', // 删除单个
  upload: '/sys/file/mgnt/upload', // 上传
  download: '/sys/file/mgnt/download' // 上传
}

interface MyUploadUserFile extends UploadUserFile {
  fileId: string
  name: string
  fileType: string
}

/**
 * @description 显示错误信息
 * @param {string} message 错误信息
 * @returns {void}
 */
function showError(message: string) {
  errorMessage.value = message
  setTimeout(() => {
    errorMessage.value = ''
  }, 4000)
}

/**
 * @description 上传文件前的校验
 * @param {File} file 文件对象
 * @returns {boolean} 是否允许上传
 */
function beforeUpload(file: File) {
  const maxSize = maxSizeMB * 1024 * 1024
  if (file.size > maxSize) {
    showError(`ファイルサイズは ${maxSizeMB}MB 以下にしてください`)
    return false
  }
  return true
}

/**
 * @description 自定义上传请求
 * @param {File} file 文件对象
 * @returns {Promise<void>}
 */
const customUploadRequest = async ({ file }: { file: File }) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('bizNo', props.bizNo)
  formData.append('fileType', props.fileType)

  isUploading.value = true
  try {
    const res = await useNuxtApp().$api(defaultUploadUrl.upload, { // 使用默认上传链接
      method: 'POST',
      body: formData
    }) as any

    if (res.success) {
      const result: MyUploadUserFile = {
        name: res.data.fileName,
        fileType: res.data.fileType,
        uid: Date.now(),
        status: 'success',
        fileId: res.data.id // Make sure this is correctly assigned
      }
      fileListRef.value = [...fileListRef.value, result];
      console.log('Uploaded file:', result); // Add this line to check the uploaded file
    } else {
      // ❌ 顯示錯誤（用你 UI 的 showError）
      showError(`アップロード失敗：${res.msg}`)
    }
  } catch (e) {
    console.error(e)
    showError('アップロードエラー')
  } finally {
    isUploading.value = false
  }
}

/**
 * @description 处理上传错误
 * @returns {void}
 */
function handleError() {
  showError('アップロードに失敗しました')
}

/**
 * @description 处理文件移除
 * @param {UploadUserFile} file 文件对象
 * @returns {void}
 */
const handleRemove = (file: UploadUserFile) => {
  console.log('File object in handleRemove:', file);
  const fileId = (file as any).fileId;
  if (!fileId) {
    showError('ファイルIDが存在しません。');
    return;
  }

  useNuxtApp().$api(`${defaultUploadUrl.delete}/${fileId}`, {
    method: 'DELETE'
  }).then((res: any) => {
    if (res.success === true) {
      // Find the index of the file to remove
      const index = fileListRef.value.findIndex(f => f.uid === file.uid);
      if (index !== -1) {
        // Remove the file from the array
        fileListRef.value.splice(index, 1);
        ElMessage({ type: 'success', message: '削除成功', style: 'z-index: 3000;' });
      } else {
        ElMessage({ type: 'error', message: 'ファイルが見つかりませんでした', style: 'z-index: 3000;' });
      }
    } else {
      ElMessage({ type: 'error', message: '削除失敗', style: 'z-index: 3000;' });
    }
  }).catch((err) => {
    console.error('削除リクエスト例外:', err);
    ElMessage({ type: 'error', message: '通信エラーが発生しました', style: 'z-index: 3000;' });
  });
};

/**
 * @description 处理文件预览
 * @param {UploadUserFile} file 文件对象
 * @returns {Promise<void>}
 */
const handlePreview = async (file: UploadUserFile) => {
  const previewFlag = props.isPreview ?? false // 是否支持预览
  const fileId = (file as any).fileId
  if (!fileId) {
    showError('ファイルIDが存在しません。')
    return
  }

  // 判断文件名是否以 .pdf 结尾（忽略大小写）
  viewFileId.value = fileId;
  downFilePdfName.value = file.name;
  if (file.name && /\.pdf$/i.test(file.name)) {
    // 弹出确认框，选择预览或下载
    viewFileFlag.value = false; // 关闭任何可能打开的预览 dialog
    currentFileForAction.value = file; // 保存当前文件引用
    console.log('准备预览PDF文件:', file.name, 'fileId:', (file as any).fileId);

    // 打开自定义对话框
    setTimeout(() => {
      pdfOperationDialogVisible.value = true;
    }, 100);

    // 这里直接 return，等待用户操作
    return;
  }

  await handlePdfDownload(fileId);
  /*if(true){
    return;
  }
  // プレビュー機能オフの場合、ダウンロード
  if (!previewFlag) {
    debugger
      const baseURL = useNuxtApp().$apiBaseURL
      const safeBaseURL = baseURL.replace(/\/$/, '')
      const safeUploadUrl = defaultUploadUrl.download.replace(/^\//, '') // 使用默认上传链接
      const url = `${safeBaseURL}/${safeUploadUrl}/${fileId}`
      // const url = `${safeBaseURL}/download/${fileId}`

      const token = window.localStorage.getItem('token')
      if (!token) {
        showError('ログイントークンが見つかりません')
        return
      }

      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!res.ok) {
          throw new Error(`HTTP ${res.status} - ${res.statusText}`)
        }

        const blob = await res.blob()
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = file.name || 'download'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)
      } catch (err: any) {
        console.error('ダウンロード失敗:', err)
        ElMessage({type: 'error', message: 'ダウンロードに失敗しました。', style: 'z-index: 3000;'});
      }
    }
    else {
      viewFileFlag.value = true
      viewFileId.value = (file as any).fileId // 确保 file.fileId 存在
        console.log('Previewing file:', file); // 添加日志输出
    }*/
}

/**
 * @description 全局拖拽处理
 * @param {DragEvent} e 拖拽事件对象
 * @returns {void}
 */
function globalDropHandler(e: DragEvent) {
  e.preventDefault()
  dragCounter = 0
  isDragging.value = false

  const files = e.dataTransfer?.files
  if (!files) return
  
  const currentCount = fileListRef.value.length
  const filesArray = Array.from(files)

  if (currentCount + filesArray.length > limit) {
    showError(`最大${limit}ファイルまでアップロード可能です。`)
    return
  }

  Array.from(files).forEach(file => {
    if (beforeUpload(file)) {
      customUploadRequest({ file })
    }
  })
}

/**
 * @description 处理拖拽进入
 * @returns {void}
 */
function handleDragEnter() {
  if (!props.enableGlobalDrop) return
  dragCounter++
  isDragging.value = true
}

/**
 * @description 处理拖拽离开
 * @returns {void}
 */
function handleDragLeave() {
  if (!props.enableGlobalDrop) return
  dragCounter--
  if (dragCounter <= 0) {
    isDragging.value = false
  }
}

/**
 * @description 处理对话框关闭事件
 */
const handleDialogClosed = () => {
  // 清除当前操作的文件引用
  currentFileForAction.value = null;
}

// 1. 初始化加载时, 默认调度查询接口, 返回的是列表, 查询条件: bizNo, fileType
onMounted(async () => {
  try {
    const res = await useNuxtApp().$api(defaultUploadUrl.list, {
      method: 'GET',
      params: {
        bizNo: props.bizNo,
        fileType: props.fileType
      }
    }) as any

    if (res.success) {
      // 3. 默认查询接口, 返回的是LIst, 返回文件ID和文件名
      fileListRef.value = res.data.map((item: any) => ({
        name: item.fileName,
        fileType: item.fileType,
        uid: Date.now(),
        status: 'success',
        fileId: item.id
      }))
    } else {
      showError(`ファイルリストの取得に失敗しました：${res.msg}`)
    }
  } catch (e) {
    console.error('ファイルリスト取得エラー', e)
    showError('ファイルリスト取得エラー')
  }
})

onUnmounted(() => {
  window.removeEventListener('dragenter', handleDragEnter)
  window.removeEventListener('dragleave', handleDragLeave)
  window.removeEventListener('dragover', e => e.preventDefault())
  window.removeEventListener('drop', globalDropHandler)
})


// 新增：通过 fileId 展示 PDF
// const showPdfByFileId = (fileId: string) => {
//   pdfOperationDialogVisible.value = false;
//   fileId = viewFileId.value;
//   viewFileId.value = fileId; // 设置要预览的 PDF 文件 ID
//   viewFileFlag.value = true; // 设置预览标志
// };

// 文件预览方法（外部组件可以覆盖此方法）
const handlePdfPreview = (fileId: string) => {
  pdfOperationDialogVisible.value = false;
  fileId = viewFileId.value;
  // showPdfByFileId(fileId);
  pdfOperationDialogVisible.value = false;
  fileId = viewFileId.value;
  viewFileId.value = fileId; // 设置要预览的 PDF 文件 ID
  viewFileFlag.value = true; // 设置预览标志
};

// 文件下载方法（外部组件可以覆盖此方法） handlePdfDownload
const handlePdfDownload = async (fileId: string) => {
  pdfOperationDialogVisible.value = false;
  if (!fileId) {
    showError('ファイルIDが存在しません。')
    return
  }
  debugger
  fileId = viewFileId.value;
  const baseURL = useNuxtApp().$apiBaseURL
  const safeBaseURL = baseURL.replace(/\/$/, '')
  const safeUploadUrl = defaultUploadUrl.download.replace(/^\//, '') // 使用默认上传链接
  const url = `${safeBaseURL}/${safeUploadUrl}/${fileId}`
  // const url = `${safeBaseURL}/download/${fileId}`

  const token = window.localStorage.getItem('token')
  if (!token) {
    showError('ログイントークンが見つかりません')
    return
  }

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - ${res.statusText}`)
    }

    const blob = await res.blob()
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = downFilePdfName.value || 'download'
    // link.download = 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  } catch (err: any) {
    console.error('ダウンロード失敗:', err)
    ElMessage({type: 'error', message: 'ダウンロードに失敗しました。', style: 'z-index: 3000;'});
  } finally {
    viewFileId.value = '';
    downFilePdfName.value = '';
  }
};

</script>

<style scoped>
.upload-area {
  margin-top: 5px;
  width: 100%;
}

.fullscreen-drag {
  position: relative;
}

.drag-overlay {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.drag-overlay-text {
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.upload-loading-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

.drag-catcher {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.error-message {
  color: red;
  font-weight: bold;
  margin: 10px 0;
  text-align: center;
}
</style>
