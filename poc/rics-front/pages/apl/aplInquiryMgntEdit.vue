<template>
  <el-form
    :inline="true"
    :model="detailRow"
    :rules="rules"
    :label-position="labelPosition"
    ref="updRowRef">

    <el-card class="el-crd-cls">
      <template #header><span class="card-header">受付情報／アキコン設置店舗詳細</span></template>
      <div class="dynamic-container-top dynamic-container">
        <el-form-item label="案件流入経路" prop="aplSource">
          <elx-select v-model="detailRow.aplInquiryMgnt.aplSource" 
                      class="width-zoom-2"
                      selectUrl="/apl/qryAplInquirySource"
                      keyName ="code" 
                      labelName ="source"
                      :disabled="isReadOnly">
          </elx-select>
        </el-form-item>
        <el-form-item label="問合せID" prop="id">
            <el-input v-model="detailRow.aplInquiryMgnt.idTemp" maxlength="100" class="width-zoom-2" :disabled="isReadOnly">
            </el-input>
        </el-form-item>
        <el-form-item label="ランク" prop="aplRank">
          <el-input
              v-model="detailRow.aplInquiryMgnt.aplRank"
              :disabled="true"
              class="width-zoom-1">
              </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="相談受付日" prop="handlingDate">
          <el-date-picker
              v-model="detailRow.aplInquiryMgnt.handlingDate"
              style="width: var(--width-zoom);"
              :disabled="isReadOnly"
              type="datetime"
              >
            </el-date-picker>
        </el-form-item>
        <el-form-item label="対応状況" prop="handlingStatus">
          <elx-select
            v-model="detailRow.aplInquiryMgnt.handlingStatus"
            selectKey="SCM_INQUIRY_RESP_STATUS"
            class="width-zoom-2"
            :disabled="isReadOnly"> 
          </elx-select>
        </el-form-item>
        <!-- <el-form-item label="アキコンログインE-mail" prop="aplInquiryMgnt.loginEmail">
          <el-input
            v-model="detailRow.aplInquiryMgnt.loginEmail"
            :disabled="isReadOnly"
            class="width-zoom-2"
            maxlength="320">
          </el-input>
        </el-form-item> -->
      </div>
    </el-card>
    <el-card class="el-crd-cls">
      <template #header><span class="card-header">相場レポート送付先</span></template>
        <div class="dynamic-container-top dynamic-container">
          <el-form-item label="氏名" prop="aplInquiryMgnt.customerName">
            <el-input
              v-model="detailRow.aplInquiryMgnt.customerName"
              :disabled="isReadOnly"
              class="width-zoom-1"
              maxlength="100">
            </el-input>
          </el-form-item>
          <el-form-item label="ひらがな" prop="aplInquiryMgnt.nameFurigana">
            <el-input
              v-model="detailRow.aplInquiryMgnt.nameFurigana"
              :disabled="isReadOnly"
              class="width-zoom-1"
              maxlength="100">
            </el-input>
          </el-form-item>
        </div>
      <!--<div class="dynamic-container">
        <el-form-item label="年齢" prop="age">
          <elx-select
            v-model="detailRow.aplInquiryMgnt.age"
            selectKey="SCM_AGE"
            :disabled="isReadOnly"
            class="width-zoom-1">
          </elx-select>
        </el-form-item>
        <el-form-item label="性別" prop="gender">
            <elx-select
              v-model="detailRow.aplInquiryMgnt.gender"
              selectKey="SCM_GENDER"
              :disabled="isReadOnly"
              class="width-zoom-1">
            </elx-select>
          </el-form-item>
         <el-form-item label="携帯電話" prop="aplInquiryMgnt.phoneNumber">
            <el-input
              v-model="detailRow.aplInquiryMgnt.phoneNumber"
              :disabled="isReadOnly"
              maxlength="20"
              class="width-zoom-1">
            </el-input>
          </el-form-item>
          <el-form-item label="ご職業" prop="occupation">
            <elx-select
              v-model="detailRow.aplInquiryMgnt.occupation"
              :disabled="isReadOnly"
              selectKey="SCM_JOB"
              class="width-zoom-1">
            </elx-select>
          </el-form-item>
        </div>-->
        <div class="dynamic-container">
<!--          <el-form-item label="今お住いの地域はどこですか？" prop="aplInquiryMgnt.currentRegion">
            <el-input
              v-model="detailRow.aplInquiryMgnt.currentRegion"
              :disabled="isReadOnly"
              maxlength="100"
              class="width-zoom-2">
            </el-input>
          </el-form-item>-->
          <el-form-item label="メールアドレス（相場レポート送付先）" prop="aplInquiryMgnt.contactEmail">
            <el-input
              v-model="detailRow.aplInquiryMgnt.contactEmail"
              :disabled="isReadOnly"
              maxlength="320"
              class="width-zoom-2">
            </el-input>
          </el-form-item>
          <el-form-item label="相場レポート郵送先" prop="aplInquiryMgnt.mailingAddress">
            <el-input
              v-model="detailRow.aplInquiryMgnt.mailingAddress"
              :disabled="isReadOnly"
              maxlength="255"
              class="width-zoom-2">
            </el-input>
          </el-form-item>
        </div>
        <el-divider></el-divider>
        <div style="width: 100%; margin-bottom: 8px;"><span style="font-weight: bold;">※相談者以外の相場レポート送付先</span></div>
        <div class="dynamic-container">
          <el-form-item label="宛名" prop="reportRecipientName">
            <el-input
              v-model="detailRow.aplInquiryMgnt.reportRecipientName"
              :disabled="isReadOnly"
              maxlength="100"
              class="width-zoom-2">
            </el-input>
          </el-form-item>
          <el-form-item label="送付先" prop="aplInquiryMgnt.reportRecipientEmail">
            <el-input
              v-model="detailRow.aplInquiryMgnt.reportRecipientEmail"
              :disabled="isReadOnly"
              maxlength="255"
              class="width-zoom-2">
            </el-input>
          </el-form-item>
        </div>
    </el-card>

    <el-card class="el-crd-cls">
      <template #header><span class="card-header">レポート送付情報 
      </span></template>
      <div class="dynamic-container" style="width: 1000px;">
        <TableAddDocReportSend
          :tableColumns="addReportSendingInfo"
          bizDataType="apl"
          :bizDataNo="detailRow.aplInquiryMgnt.id"
          :tableUrl="addReportSendingUrl"
          :isReadOnly="isReadOnly"
          :fixBtn1IsReadOnly="false"
          fixBtn1="ダウンロード"
          fixBtn2="プレビュー"
          @fixBtn1="handleDownload"
          @fixBtn2="viewReportPdf"
          :key="reportListKey"
          ref="aplReportSendListRef"/>
      </div>
      <!-- <p/> -->
      <div class="dynamic-container" style="margin-bottom: -10px;margin-top: 10px;">
        <el-popconfirm 
          title="レポート送付してもよろしいですか？" 
          confirm-button-text="はい" 
          cancel-button-text="いいえ" 
          @confirm="sendReport">
          <template #reference>
            <el-button :disabled="!isReadOnly">レポート送付</el-button>
          </template>
        </el-popconfirm>
        <el-button :disabled="!isReadOnly" @click="showUploadComponent">帳票アップロード</el-button>
      </div>

    </el-card>

    <el-card class="el-crd-cls">
      <template #header><span class="card-header">対応履歴</span></template>
      <div class="dynamic-container" style="width: 1000px;">
      <!-- :tableUrl="tableUrlAddDoc"-->
        <TableAddDoc
          :tableColumns="addDocTableColumns"
          bizDataType="apl"
          :bizDataNo="detailRow.aplInquiryMgnt.id"
          :isReadOnly="isReadOnly"
          :key="$forceReload()"
          ref="tableComtRefAddDoc"/>
      </div><p/>
    </el-card>

    
    <el-card class="el-crd-cls">

      <div class="dynamic-container">
        <otoiawaseComponent
          :lisOtoiawaseUrl="lisOtoiawaseUrl"
          :inquiryId="detailRow.aplInquiryMgnt.id"
          :key="$forceReload()"
          :isReadOnly="isReadOnly"
          ref="lisOtoiawaseRef"/>
      </div>
    </el-card>

    <!-- <el-card class="el-crd-cls">
      <template #header><span class="card-header">一時的ボタンエリア</span></template>
      <div class="dynamic-container">
        <el-button
          type="primary"
          @click="save"
          v-show="!isReadOnly"
          :loading="loadingSave">
          保存
        </el-button>
      </div>
    </el-card> -->

    <div class="detail-btn-group-cls">
        <el-button type="primary" @click="save" v-show="!isReadOnly" :loading="loadingSave">保存する</el-button>
        <el-button @click="emit('close')">閉じる</el-button>
      </div>
  </el-form>

  <!-- UploadSmart 组件 -->
  <el-dialog 
    v-model="isUploadVisible" 
    title="帳票アップロード" 
    width="50%" 
    :close-on-click-modal="false"
  >
    <!-- 使用方括号访问带特殊字符的属性 -->
    <UploadSmart 
      @file-uploaded="handleFileUpload" 
      :biz-no="detailRow.aplInquiryMgnt.id" 
      :sendMod="detailRow.aplInquiryMaster['Q13(1)-1']" 
      biz-type="aplReportUpload" 
    />
  </el-dialog>

  <!-- 帐票预览对话框 -->
  <el-dialog v-model="viewFileFlag" title="帳票プレビュー" width="80%">
    <!-- <PdfViewer fileId="FL1925010812930494464" /> -->
    <PdfEmbedVierwer :fileId="viewFileId" :key="$forceReload()"/>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, reactive, ref, computed, watch } from 'vue';
// import axios from 'axios' // 引入 axios
import { useFetch } from '#app'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ComponentSize, FormProps } from 'element-plus'
import PdfEmbedVierwer from '@/components/PdfEmbedViewer.vue'
import '~/assets/css/app.css';
const { $toLocalISOString } = useNuxtApp();
const viewFileId = ref(''); // 用于存储要预览的 PDF 文件 ID
const viewFileFlag = ref(false); // 用于存储要预览的 PDF 文件 ID


// 对应履历模块  Ootoiawase
import TableAddDoc from '@/components/TableCommAddDoc.vue'
import otoiawaseComponent from '@/components/otoiawaseComponent.vue'
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
import TableAddDocReportSend from '@/components/TableCommAddDocReport.vue'
import { is } from '@vee-validate/rules';
const aplReportSendListRef = ref(null);
const addReportSendingUrl = ref("/apl/report/send/list")
const addReportSendingInfo = [
// <elx-select v-model="formModel.addRow.creationWorker" class="width-zoom-1" selectUrl="/sys/user/qryByUserType/3,4"  keyName = "id" labelName = "fullName"></elx-select>
{ prop: 'deliveryMod', label: '送付方法', inTyp: 'select', selectKey: "REPORT_SEND_MOD", width: '130', disabledParams: true},
{ prop: 'sendSts', label: '送付状態', inTyp: 'select', selectKey: "STSTE_SEND_REPORT", width: '150'},
{ prop: 'sentDate', label: 'レポート送付日', inTyp: 'date', width: '140'},
{ prop: 'worker', label: '対応ワーカー', inTyp: 'select', selectUrl: '/sys/user/qryByUserType/3,4', keyName: 'id', labelName: 'fullName', width: '160'},
{ prop: 'fileName', label: 'ファイル', inTyp: 'text', width: '280'},
{ prop: 'remark', label: '備考', inTyp: 'text', width: '160' },
]
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

const formatMobileNumber = () => {
  if (!props.detailRow.aplInquiryMgnt.phoneNumber) return;
  
  // 数字のみを抽出
  const numbers = props.detailRow.aplInquiryMgnt.phoneNumber.replace(/[^0-9]/g, '');
  
  // 11桁の場合のみフォーマット
  if (numbers.length === 11) {
    props.detailRow.aplInquiryMgnt.phoneNumber = numbers.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
  }
};

onMounted(() => {
  // 初期表示時のフォーマット処理
  if (props.detailRow.aplInquiryMgnt.phoneNumber) {
    //formatMobileNumber();
  }
  props.detailRow.aplInquiryMgnt.idTemp = props.detailRow.aplInquiryMgnt.id;
});
const save = async () => {
  loadingSave.value = true;
  // ここでバリデーションを実行
  const isValid = await validateForm(updRowRef.value);
  if (!isValid) {
    loadingSave.value = false;
    return;
  }

  try {
    loadingSave.value = true;
    // props.detailRow.aplInquiryMgnt.handlingDate = $toLocalISOString(props.detailRow.aplInquiryMgnt.handlingDate);

    const response = await useNuxtApp().$api(props.editUrl, {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: {
        aplInquiryMgnt: props.detailRow.aplInquiryMgnt,
        bizProgressHistoryList: tableComtRefAddDoc.value.getTableData(),
        aplInquiryMasterList: lisOtoiawaseRef.value.getTableData(),
        aplReportSendList: aplReportSendListRef.value.getTableData(),
      }
    })

    if (response.success) {
      emit('save', response);
      return;
    }
    ElMessage({type: 'error', message: response.msg, style: 'z-index: 3000;'});
  } catch (error) {
    ElMessage({type: 'error', message: response.msg, style: 'z-index: 3000;'});
  }finally {
    loadingSave.value = false;
  }
};

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

// 预览 PDF 文件的函数
const viewReportPdf = async (row: number) => {
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
      ElMessage({ type: 'warning', message: '帳票が存在しないか、まだ作成されていません。', style: 'z-index: 3000;' });
      return;
    }
    showPdfByFileId(rowData.fileId);
  } catch (error) {
    ElMessage({ type: 'error', message: 'エラーが発生しました: ' + error, style: 'z-index: 3000;' });
  }
};

// 新增：通过 fileId 展示 PDF
const showPdfByFileId = (fileId: string) => {
  viewFileId.value = fileId; // 设置要预览的 PDF 文件 ID
  viewFileFlag.value = true; // 设置预览标志
};

const rules = {
  'aplInquiryMgnt.customerName': [{required: true, message: '相談者の名前を入力してください', trigger: 'blur'},],
  'aplInquiryMgnt.nameFurigana': [{required: true, message: '名前のフリガナを入力してください', trigger: 'blur'},],
  'aplInquiryMgnt.currentRegion': [{required: true, message: '現住所を入力してください', trigger: 'blur'},],
  'aplInquiryMgnt.phoneNumber': [{required: true, message: '電話番号を入力してください', trigger: 'blur'},
  {required: false, pattern: /^[0-9]{10,11}$/, message: '正しい電話番号の形式で入力してください', trigger: ['blur', 'change'] }],
  'aplInquiryMgnt.loginEmail': [{
    required: false,
    type: 'email',
    message: '正しいメールアドレスの形式で入力してください',
    trigger: ['blur', 'change']
  }],
  'aplInquiryMgnt.contactEmail': [{
    required: false,
    type: 'email',
    message: '正しいメールアドレスの形式で入力してください',
    trigger: ['blur', 'change']
  }],
  'aplInquiryMgnt.reportRecipientEmail': [{
    required: false,
    type: 'email',
    message: '正しいメールアドレスの形式で入力してください',
    trigger: ['blur', 'change']
  }],
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
    const inquiryId = props.detailRow.aplInquiryMgnt.id; // 获取 inquiryId
    const fileId = file.data.id; // 获取 fileId
    const response = await useNuxtApp().$api(`/apl/inquiry_mgnt/handleUpload/${inquiryId}/${fileId}`, {
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




