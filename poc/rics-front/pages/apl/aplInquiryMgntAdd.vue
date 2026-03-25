<template>
  <el-form
    label-width="80px"
    :rules="rules"
    :model="addRow"
    :inline="true"
    :label-position="labelPosition"
    ref="addRowRef">
    <el-card class="el-crd-cls" >
      <template #header><span class="card-header">受付情報／アキコン設置店舗詳細</span></template>
      <div class="dynamic-container-top dynamic-container">
        <!-- <el-form-item label="問合せID" prop="inquiryId">
            <el-input v-model="addRow.inquiryId" maxlength="100" class="width-zoom-2" :disabled="true">
            </el-input>
        </el-form-item> -->
        <el-form-item label="案件流入経路" prop="aplSource">
          <elx-select v-model="addRow.aplSource" 
                      class="width-zoom-2"
                        selectUrl="/apl/qryAplInquirySource"
                        keyName ="code" 
                        labelName ="source"
                      :disabled="false">
          </elx-select>
        </el-form-item>
        <!-- <el-form-item label="ランク" prop="aplRank">
          <-- <elx-select v-model="addRow.aplRank" selectKey="SCM_INTERVIEW_RANK" class="width-zoom-1" :disabled="true"></elx-select>
          <el-input v-model="addRow.aplRank" class="width-zoom-1">
        </el-form-item> -->
      </div>
      <div class="dynamic-container">
        <el-form-item label="相談受付日" prop="handlingDate">
          <el-date-picker
            v-model="addRow.handlingDate"
            style="width: var(--width-zoom);"
            type="datetime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="対応状況" prop="handlingStatus">
          <elx-select v-model="addRow.handlingStatus" selectKey="SCM_INQUIRY_RESP_STATUS" class="width-zoom-2"></elx-select>
        </el-form-item>
        <!-- <el-form-item label="アキコンログインE-mail" prop="loginEmail">
          <el-input v-model="addRow.loginEmail" maxlength="320" class="width-zoom-2">
          </el-input>
        </el-form-item> -->
        
      </div>
    </el-card>
    <el-card class="el-crd-cls">
      <template #header><span class="card-header">相場レポート送付先</span></template>
        <div class="dynamic-container-top  dynamic-container">
          <el-form-item label="氏名" prop="customerName">
            <el-input v-model="addRow.customerName" maxlength="100" class="width-zoom-1">
            </el-input>
          </el-form-item>
          <el-form-item label="ひらがな" prop="nameFurigana">
            <el-input v-model="addRow.nameFurigana" maxlength="100" class="width-zoom-1">
            </el-input>
          </el-form-item>
        </div>
<!--        <div class="dynamic-container">
          <el-form-item label="年齢" prop="age">
            <elx-select v-model="addRow.age" selectKey="SCM_AGE" class="width-zoom-1">
            </elx-select>
          </el-form-item>
          <el-form-item label="性別" prop="gender">
            <elx-select v-model="a0ddRow.gender" selectKey="SCM_GENDER" class="width-zoom-1">
            </elx-select>
          </el-form-item>
          <el-form-item label="携帯電話" prop="phoneNumber">
            <el-input v-model="addRow.phoneNumber" maxlength="20"
            class="width-zoom-1">
            </el-input>
          </el-form-item>
          <el-form-item label="ご職業" prop="occupation">
            <elx-select v-model="addRow.occupation" selectKey="SCM_JOB" class="width-zoom-1">
            </elx-select>
          </el-form-item>
        </div>-->
        <div class="dynamic-container">
<!--          <el-form-item label="今お住いの地域はどこですか？" prop="currentRegion">
            <el-input v-model="addRow.currentRegion" maxlength="100" class="width-zoom-2">
            </el-input>
          </el-form-item>-->
          <el-form-item label="メールアドレス（相場レポート送付先）" prop="contactEmail">
            <el-input v-model="addRow.contactEmail" maxlength="320" class="width-zoom-2">
            </el-input>
          </el-form-item>
          <el-form-item label="相場レポート郵送先" prop="mailingAddress">
            <el-input
              v-model="addRow.mailingAddress"
              maxlength="255"
              class="width-zoom-2">
            </el-input>
          </el-form-item>
        </div>
        <el-divider></el-divider>
        <div style="width: 100%; margin-bottom: 8px;"><span style="font-weight: bold;">※相談者以外の相場レポート送付先</span></div>
        <div class="dynamic-container">
            <el-form-item label="宛名" prop="reportRecipientName">
              <el-input v-model="addRow.reportRecipientName" maxlength="100" class="width-zoom-2">
              </el-input>
            </el-form-item>
            <el-form-item label="送付先" prop="reportRecipientEmail">
              <el-input v-model="addRow.reportRecipientEmail" maxlength="255" class="width-zoom-2">
              </el-input>
            </el-form-item>
        </div>
    </el-card>
    <!-- <el-card class="el-crd-cls">
      <template #header><span class="card-header">レポート送付情報 
      </span></template>
      <div class="dynamic-container" style="width: 1000px;">
        <TableAddDoc
          :tableColumns="addReportSendingInfo"
          bizDataType="apl"
          ref="aplReportSendList"/>
      </div><p/>
    </el-card> -->

    <el-card class="el-crd-cls">

      <!-- <div class="dynamic-container" style="margin-top: 8px;">
        <el-form-item label="回答日時" prop="date">
          <el-date-picker
            v-model="date"
            style="width: var(--width-zoom);"
            type="datetime">
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="dynamic-container" style="margin-bottom: 8px;">
        <span style="font-size: 20px; font-weight: bold; color: rgb(122 83 235);">空き家についてお聞かせください</span>
      </div>
      <div class="dynamic-container">
        <el-form-item label="Q1 空き家の所在地をお教えください。" prop="Q1">
          <elx-checkbox-group style="width:70%;" v-model="Q1" selectKey="EQ_EMPTY_HOUSE_LOCATION"></elx-checkbox-group>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="Q2 空き家を所有していますか？" prop="Q2">
          <elx-select v-model="Q2" selectKey="EQ_OWNERSHIP_STATUS" class="width-zoom-3">
          </elx-select>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="Q3 取得した経緯を教えてください。" prop="Q3">
          <elx-checkbox-group style="display: flex; flex-direction: column; align-items: flex-start;" v-model="Q3" selectKey="EQ_OBTAINED_SITUATION"></elx-checkbox-group>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="Q4 建物を利用しなくなった理由をお聞かせください。" prop="Q4">
          <elx-checkbox-group style="display: flex; flex-direction: column; align-items: flex-start;" v-model="Q4" selectKey="EQ_NOTUSING_REASON"></elx-checkbox-group>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="Q5 空き家にしている期間を教えてください。" prop="Q5">
          <elx-select v-model="Q5" selectKey="EQ_NOTUSING_TIME" class="width-zoom-3">
          </elx-select>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="Q6 空き家の築年数は何年ですか？" prop="Q6">
          <elx-select v-model="Q6" selectKey="EQ_NOTUSING_CONSTRUCTION_YEARS" class="width-zoom-3">
          </elx-select>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="Q7 現在の利用状況についてお聞かせください。" prop="Q7">
          <elx-checkbox-group style="display: flex; flex-direction: column; align-items: flex-start;" v-model="Q7" selectKey="EQ_CURRENT_USAGE_STATUS"></elx-checkbox-group>
        </el-form-item>
      </div>
      <div class="dynamic-container" style="margin-bottom: 8px;">
        <span style="font-size: 20px; font-weight: bold; color: rgb(122 83 235);">管理について</span>
      </div>
      <div class="dynamic-container">
        <el-form-item label="Q8 維持管理の頻度について教えてください。" prop="Q8">
          <elx-checkbox-group style="display: flex; flex-direction: column; align-items: flex-start;" v-model="Q8" selectKey="EQ_MAINTENANCE_FREQUENCY"></elx-checkbox-group>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="Q9 誰が行なっていますか？" prop="Q9">
          <elx-select v-model="Q9" selectKey="EQ_DOING_USER" class="width-zoom-3">
          </elx-select>
        </el-form-item>
      </div>
      <div class="dynamic-container" style="margin-bottom: 8px;">
        <span style="font-size: 20px; font-weight: bold; color: rgb(122 83 235);">将来のお考え</span>
      </div>
      <div class="dynamic-container">
        <el-form-item label="Q10 将来の空き家の選択肢を決めていますか？" prop="Q10">
          <elx-checkbox-group style="display: flex; flex-direction: column; align-items: flex-start;" v-model="Q10" selectKey="EQ_FUTURE_VACANT_HOUSE"></elx-checkbox-group>
        </el-form-item>
      </div>
      <div class="dynamic-container" style="margin-bottom: 8px;">
        <span style="font-size: 20px; font-weight: bold; color: rgb(122 83 235);">空き家の詳細情報</span>
      </div>
      <div class="dynamic-container">
        <el-form-item label="Q11 不動産の名義人氏名" prop="Q11">
          <el-input v-model="Q11" class="width-zoom-3">
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="Q12 名義人と相談者の関係" prop="Q12">
          <el-input v-model="Q12" class="width-zoom-3">
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="Q13 所有地の住居表示（住所）郵便番号" prop="Q13">
          <el-input v-model="Q13" class="width-zoom-3">
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="Q13-1 所有地の住居表示（住所）住所" prop="Q13_1">
          <el-input v-model="Q13_1" class="width-zoom-3">
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="Q14 所有地の地番を教えてください。※固定資産税の納付書などを確認し、正確にご入力ください" prop="Q14">
          <el-input v-model="Q14" class="width-zoom-3">
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="Q15 土地と建物の名義人が異なりますか？" prop="Q15">
          <elx-select v-model="Q15" selectKey="EQ_LAND_BUILDING_OWNER" class="width-zoom-3">
          </elx-select>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="Q15-1 「はい」を選択した場合、説明をご記入ください。" prop="Q15_1">
          <el-input v-model="Q15_1" class="width-zoom-3">
          </el-input>
        </el-form-item>
      </div> -->
      <div class="dynamic-container" >
        <otoiawaseComponent  
          :lisOtoiawaseUrl="lisOtoiawaseUrl"
          :key="$forceReload()"
          ref="lisOtoiawaseRef"/>
      </div>
    </el-card>
    <!-- <el-card class="el-crd-cls">
      <template #header><span class="card-header">一時的ボタンエリア</span></template>
      <div class="dynamic-container" >
        <el-button type="primary" @click="save" :loading="loadingSave">保存</el-button>
      </div>
    </el-card> -->

    <div class="detail-btn-group-cls">
        <el-button type="primary" @click="save" :loading="loadingSave">保存する</el-button>
        <el-button @click="emit('close')">閉じる</el-button>
      </div>
  </el-form>
</template>

<script lang="ts" setup>
import {defineProps, defineEmits, reactive, ref} from 'vue';
import otoiawaseComponent from '@/components/otoiawaseComponent.vue'
import TableAddDoc from '@/components/TableCommAddDoc.vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import type { FormProps } from 'element-plus'
import '~/assets/css/app.css';

const lisOtoiawaseRef = ref(null);
const aplReportSendList = ref(null);
const lisOtoiawaseUrl = ref("/apl/inquiry/lisOtoiawase");
const labelPosition = ref<FormProps['labelPosition']>('top');
const loadingSave = ref(false);
const addRowRef = ref();

const addRow = reactive({
  id: "",
  handlingDate: "",
  handlingStatus: "",
  loginEmail: "",
  customerName: "",
  nameFurigana: "",
  currentRegion: "",
  phoneNumber: "",
  contactEmail: "",
  age: "",
  gender: "",
  occupation: "",
  reportRecipientName: "",
  reportRecipientEmail: "",
  rank: "",
  inquiryId: "",
  aplSource: "", /* 案件流入経路 - def本地 P01  应该自定义选择, 因为可能涉及到补录 */
  mailingAddress: "",
  aplRank: "",
});

const addReportSendingInfo = [
{ prop: 'shippingMethod', label: '送付方法', inTyp: 'select', selectKey: "REPORT_SEND_MOD", width: '160'},
{ prop: 'reportSendingDate', label: 'レポート送付日', inTyp: 'date', width: '160'},
{ prop: 'correspondingWorker', label: '対応ワーカー', inTyp: 'select', selectUrl: '/sys/user/qryByUserType/3,4', keyName: 'id', labelName: 'fullName', width: '160'},
{ prop: 'file', label: 'ファイル', inTyp: 'text', width: '280'},
{ prop: 'resend', label: '送付状態', inTyp: 'text', width: '100'},
]

const props = defineProps({
  addUrl: String,
});

const formatMobileNumber = () => {
  if (!addRow.phoneNumber) return;
  
  // 数字のみを抽出
  const numbers = addRow.phoneNumber.replace(/[^0-9]/g, '');
  
  // 11桁の場合のみフォーマット
  if (numbers.length === 11) {
    addRow.phoneNumber = numbers.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
  }
};
const emit = defineEmits(['save', 'close']);

const save = async () => {
  loadingSave.value = true;

   // ここでバリデーションを実行
   const isValid = await validateForm(addRowRef.value);
  if (!isValid) {
    loadingSave.value = false;
    return;
  }
  try {
    const response = await useNuxtApp().$api(props.addUrl, {
      method: 'PUT',
      headers: {"Content-Type": "application/json"},
      body: {
        aplInquiryMgnt: addRow,
        aplInquiryMasterList: lisOtoiawaseRef.value.getTableData(),
        // aplReportSendList: aplReportSendList.value.getTableData(),
      }
    })

    if (response.success) {
      emit('save', response);
      return;
    }
    ElMessage({type: 'error', message: response.msg, style: 'z-index: 3000;'});
  } catch (error) {
    ElMessage({type: 'error', message: 'query error: ' + error, style: 'z-index: 3000;'});
  } finally {
    loadingSave.value = false;
  }
};

const rules = {
  customerName: [{required: true, message: '名前を入力してください', trigger: 'blur'},],
  nameFurigana: [{required: true, message: 'フリガナを入力してください', trigger: 'blur'},],
  currentRegion: [{required: true, message: '現住所を入力してください', trigger: 'blur'},],
  aplSource: [{required: true, message: '案件流入経路を入力してください', trigger: 'blur'},],
  phoneNumber: [{required: true, message: '携帯電話を入力してください', trigger:['blur', 'change']},
  {
    pattern: /^[0-9]{10,11}$/,
    message: '正しい携帯番号の形式で入力してください',
    trigger: ['blur', 'change']
  }],
  loginEmail: [{
    required: false,
    type: 'email',
    message: '正しいメールアドレスの形式で入力してください',
    trigger: ['blur', 'change']
  }],
  contactEmail: [{
    required: false,
    type: 'email',
    message: '正しいメールアドレスの形式で入力してください',
    trigger: ['blur', 'change']
  }],
  reportRecipientEmail: [{
    required: false,
    type: 'email',
    message: '正しいメールアドレスの形式で入力してください',
    trigger: ['blur', 'change']
  }],
};
</script>

<style scoped>

/* .el-crd-cls {
  width: 90%;
  margin: 10px auto;
} */

el-form-item {
  flex: 1 1 calc(25% - 16px);
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