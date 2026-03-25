<template>

  <!-- UploadSmart 组件 -->
<!--   :sendMod="detailRow.aplInquiryMaster['Q13(1)-1']"-->

    <!-- 使用方括号访问带特殊字符的属性 -->
    <UploadSmart
        @file-uploaded="handleFileUpload"
        biz-no="2025-05-23"
        sendMod="0"
        biz-type="tempUpload"
    />
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, reactive, ref, computed, watch } from 'vue';
// import axios from 'axios' // 引入 axios
import { useFetch } from '#app'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ComponentSize, FormProps } from 'element-plus'
import '~/assets/css/app.css';
const { $toLocalISOString } = useNuxtApp();

// 对应履历模块  Ootoiawase
import UploadSmart from '@/components/UploadSmart.vue';

const tableUrlAddDoc = ref("");
const lisOtoiawaseUrl = ref("/apl/inquiry/lisOtoiawase");
const aplRegenatePdfUrl = ref("/apl/inquiry_mgnt/regenerate");
const tableComtRefAddDoc = ref(null);
const lisOtoiawaseRef = ref(null);
const addDocTableColumns = [
  { prop: 'actionDate', label: '日付', inTyp: 'date', width: '160'},
  { prop: 'actionContent', label: '対応履歴' , inTyp: 'textarea', width: '700'},
]

// レポート送付情報
const aplReportSendListRef = ref(null);

const submitRuleFormAddDoc = async () => {
  const tableData = tableComtRefAddDoc.value.getTableData();
  console.log('表データ:', tableData);
}

const submitRuleFormAddDoc22 = async () => {
  const tableDataToia = lisOtoiawaseRef.value.getTableData();
  console.log('Toiawaseデータ:', tableDataToia);
}

const labelPosition = ref<FormProps['labelPosition']>('top');
const emit = defineEmits(['save', 'close']);
const { $api } = useNuxtApp()
const loadingSave = ref(false);
const formRef = ref({});
const updRowRef = ref();

const props = defineProps({
  editUrl: String,
  isReadOnly: Boolean,
  detailRow: {
    type: Object,
    required: true,
  }
});

const sendReport = async () => {
  try {
    // 直接执行发送报告逻辑
    console.log('props.detailRow.aplInquiryMgnt.id', props.detailRow.aplInquiryMgnt.id);
    const response = await useNuxtApp().$api(`${aplRegenatePdfUrl.value}/${props.detailRow.aplInquiryMgnt.id}`, {
      method: 'GET'
    });
    if (response.success) {
      ElMessage({ type: 'success', message: 'レポートが正常に送付されました', style: 'z-index: 3000;' });
    } else {
      ElMessage({ type: 'error', message: 'レポート送付に失敗しました: ' + response.msg, style: 'z-index: 3000;' });
    }
  } catch (error) {
    ElMessage({ type: 'error', message: 'エラーが発生しました: ' + error, style: 'z-index: 3000;' });
  }
};

const handleDownload = async (row: number) => {
  try {
    // 从 aplReportSendList 获取表格数据
    const tableData = aplReportSendListRef.value?.getTableData();
    if (!tableData || tableData.length === 0) {
      ElMessage({ type: 'warning', message: '表データが空です', style: 'z-index: 3000;' });
      return;
    }

    // 根据行号获取对应的数据行
    const rowData = tableData[row];
    if (!rowData) {
      ElMessage({ type: 'warning', message: '指定された行データが存在しません', style: 'z-index: 3000;' });
      return;
    }

    if (!rowData.fileId) {
      ElMessage({ type: 'warning', message: 'ファイルIDが存在しません', style: 'z-index: 3000;' });
      return;
    }

    try {
      const baseURL = useNuxtApp().$apiBaseURL;
      const safeBaseURL = baseURL.replace(/\/$/, '');
      const url = `${safeBaseURL}/sys/file/mgnt/download/${rowData.fileId}`;
      const token = window.localStorage.getItem('token');
      if (!token) {
        ElMessage({ type: 'error', message: 'ログイントークンが見つかりません', style: 'z-index: 3000;' });
        return;
      }

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} - ${res.statusText}`);
      }

      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = rowData.fileName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      ElMessage({ type: 'success', message: 'ファイルが正常にダウンロードされました', style: 'z-index: 3000;' });
    } catch (error) {
      ElMessage({ type: 'error', message: 'エラーが発生しました: ' + error, style: 'z-index: 3000;' });
    }
  } catch (error) {
    ElMessage({ type: 'error', message: 'エラーが発生しました: ' + error, style: 'z-index: 3000;' });
  }
};

const uploadReport = async () => {
  // 帳票アップロード的逻辑
  console.log('帳票アップロード処理を実行中...');
};

const isUploadVisible = ref(false);

const showUploadComponent = () => {
  isUploadVisible.value = true;
};

const reportListKey = ref(0); // 用于强制刷新列表的 key

const handleFileUpload = async (file: any) => {
  // 检测上传是否成功
  if (!file.success) {
    console.error('ファイルのアップロードに失敗しました:', file);
    ElMessage({ type: 'error', message: 'ファイルのアップロードに失敗しました', style: 'z-index: 3000;' }); // 使用 ElMessage 展示错误信息
    return;
  }

  try {
    // 调用后台接口
    const fileId = file.data.id; // 获取 fileId
    const response = await useNuxtApp().$api(`/biz/data/handleUpload/${fileId}`, {
      method: 'GET',
    });

    if (response.success) {
      console.log('バックエンド処理が成功しました:', response);
      ElMessage({ type: 'success', message: 'バックエンド処理が成功しました', style: 'z-index: 3000;' });
      reportListKey.value++; // 修改 key 值，强制重新渲染组件
    } else {
      console.error('バックエンド処理が失敗しました:', response.msg);
      ElMessage({ type: 'error', message: response.msg || 'バックエンド処理が失敗しました', style: 'z-index: 3000;' }); // 使用 ElMessage 展示错误信息
    }
  } catch (error) {
    console.error('バックエンド処理中にエラーが発生しました:', error);
    ElMessage({ type: 'error', message: 'バックエンド処理中にエラーが発生しました', style: 'z-index: 3000;' }); // 使用 ElMessage 展示错误信息
  } finally {
    isUploadVisible.value = false; // 上传完成后关闭对话框
  }
};
</script>

<style scoped>
/* .el-form-item{
 margin-right:1px;
} */
/* .dynamic-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 0 auto;
} */

.full-width-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
}

/* .el-crd-cls {
  width: 90%;
  margin: 10px auto;
} */

el-form-item {
  flex: 1 1 calc(25% - 16px);
  margin-right:1px;
}

@media screen and (max-width: 768px) {
  el-form-item {
    flex: 1 1 calc(50% - 16px);
  }
}

@media screen and (max-width: 480px) {
  el-form-item {
    flex: 1 1 100%;
  }
}

</style>




