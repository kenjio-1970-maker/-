<script setup>
import VuePdfEmbed from 'vue-pdf-embed'

// optional styles
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

const props = defineProps({
  fileId: {
    type: String,
    required: true
  }
})

import { useNuxtApp } from '#app'
import { ref, onMounted } from 'vue'

const pdfSource = ref(null) // PDF 数据
const error = ref('')
const loading = ref(false)

const fetchPdfData = async () => {
  if (!props.fileId) {
    error.value = 'ファイルIDが提供されていません。'
    return
  }

  error.value = ''
  loading.value = true

  try {
    const baseURL = useNuxtApp().$apiBaseURL
    const safeBaseURL = baseURL.replace(/\/$/, '')
    // const pdfUrl = `${safeBaseURL}/biz/cat/pdf/${props.fileId}`
    const pdfUrl = `${safeBaseURL}/sys/file/mgnt/pdf/${props.fileId}`

    const token = window.localStorage.getItem('token')
    if (!token) {
      error.value = 'ログイントークンが見つかりませんでした。'
      return
    }

    const response = await fetch(pdfUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      if (response.status === 401) {
        error.value = '認証されていません。再度ログインしてください。'
      } else if (response.status === 404) {
        error.value = 'ファイルが見つかりませんでした。'
      } else {
        error.value = `読み込みに失敗しました。エラーコード: ${response.status}`
      }
      return
    }

    const pdfData = await response.arrayBuffer()
    //console.log('Original ArrayBuffer length:', pdfData.byteLength) // 打印原始数据长度

    // 测试直接使用 ArrayBuffer
    pdfSource.value = pdfData // 不转换为 Uint8Array，直接使用 ArrayBuffer

    // 如果需要测试 Uint8Array 转换，取消注释以下代码
    // const uint8ArrayData = new Uint8Array(pdfData)
    // console.log('Uint8Array length:', uint8ArrayData.length) // 打印转换后的数据长度
    // pdfSource.value = uint8ArrayData
  } catch (err) {
    error.value = 'PDFを読み込めませんでした。ネットワークまたはファイルパスを確認してください。'
    console.error('Error fetching PDF:', err)
  } finally {
    loading.value = false
  }
}

async function downloadPdf() {
  if (!props.fileId) {
    showError('ファイルIDが存在しません。')
    return
  }

    const baseURL = useNuxtApp().$apiBaseURL
    const safeBaseURL = baseURL.replace(/\/$/, '')
    const pdfUrl = `${safeBaseURL}/sys/file/mgnt/download/${props.fileId}`
  // const url = `${safeBaseURL}/download/${fileId}`

  const token = window.localStorage.getItem('token')
  if (!token) {
    showError('ログイントークンが見つかりません')
    return
  }

  try {
    const res = await fetch(pdfUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - ${res.statusText}`)
    }

    const disposition = res.headers.get('Content-Disposition');
    let fileName = 'download.pdf';
    if (disposition) {
      // 兼容 filename*=UTF-8''xxx.pdf
      const match = disposition.match(/filename\*=UTF-8''(.+)/);
      if (match && match[1]) {
        fileName = decodeURIComponent(match[1]);
      } else {
        // 兼容 filename="xxx.pdf"
        const match2 = disposition.match(/filename="?([^"]+)"?/);
        if (match2 && match2[1]) {
          fileName = decodeURIComponent(match2[1]);
        }
      }
    }
    const blob = await res.blob()
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  } catch (err) {
    console.error('ダウンロード失敗:', err)
    ElMessage({type: 'error', message: 'ダウンロードに失敗しました。', style: 'z-index: 3000;'});
  }
};

onMounted(fetchPdfData)
</script>

<template>
  <div class="pdf-embed-viewer">
    <el-button
      v-if="fileId"
      @click="downloadPdf"
      type="primary"
      class="download-icon-btn"
      :title="'ダウンロード'"
    >
      <el-icon><Download /></el-icon>
    </el-button>
    <VuePdfEmbed
      v-if="pdfSource"
      annotation-layer
      text-layer
      :source="pdfSource"
    />

    <p v-if="loading" class="loading">読み込み中です。少々お待ちください。</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<style scoped>
.pdf-embed-viewer {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.loading {
  color: #666;
  text-align: center;
  margin-top: 10px;
}
.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}

.download-icon-btn {
  position: absolute;
  top: 0px;
  right: 30px;
  z-index: 3000;
  margin-top: -px;
}
.pdf-embed-viewer {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
