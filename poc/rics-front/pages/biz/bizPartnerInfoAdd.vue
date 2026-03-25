<template>
  <el-form 
  label-width="80px" 
  :rules="rules" 
  :model="addRow" 
  :inline="true" 
  :label-position="labelPosition"
  ref="addRowRef"
  >
    <el-card class="el-crd-cls">
      <template #header><span class="card-header">基本情報</span></template>
        <div class="dynamic-container" >
          <el-form-item label="レコード番号" prop="recordNo">
            <el-input
              v-model="addRow.recordNo" 
              maxlength="100"
              class="width-zoom-1">
            </el-input>
          </el-form-item>
          <el-form-item label="レコードタイプ" prop="recordType">
            <elx-checkbox-group 
              v-model="addRow.recordType" 
              selectKey="BIZ_RECORD_TYPE" 
              groupName="gtpName"
              class="width-zoom-1">
            </elx-checkbox-group>
          </el-form-item>
        </div>
        <div class="dynamic-container" >
          <el-form-item label="協力業者ランク" prop="partnerRank">
            <elx-select v-model="addRow.partnerRank" selectKey="BIZ_PARTNER_RANK" class="width-zoom-1">
            </elx-select>
          </el-form-item>
          <el-form-item label="業種" prop="industry">
            <elx-select v-model="addRow.industry" selectKey="BIZ_INDUSTRY" class="width-zoom-1">
            </elx-select>
          </el-form-item>
          <el-form-item label="その他" prop="other">
            <el-input v-model="addRow.other" maxlength="100" class="width-zoom-1">
            </el-input>
          </el-form-item>
          <el-form-item label="登録日" prop="registrationDate">
            <el-date-picker v-model="addRow.registrationDate" type="date" style="width: var(--width-zoom-1);">
            </el-date-picker>
          </el-form-item>
        </div>
    </el-card>

    <el-card class="el-crd-cls">
      <template #header><span class="card-header">企業概要</span></template>
        <div class="dynamic-container" > 
          <el-form-item label="会社名" prop="companyName">
            <el-input v-model="addRow.companyName" maxlength="255" class="width-zoom-1">
            </el-input>
          </el-form-item>
          <el-form-item label="部署名" prop="departmentName">
            <el-input v-model="addRow.departmentName" maxlength="255" class="width-zoom-1">
            </el-input>
          </el-form-item>
          <el-form-item label="担当者名" prop="representativeName">
            <el-input v-model="addRow.representativeName" maxlength="255" class="width-zoom-1">
            </el-input>
          </el-form-item>
          <el-form-item label="役職" prop="position">
            <el-input v-model="addRow.position" maxlength="80" class="width-zoom-1">
            </el-input>
          </el-form-item>
        </div>
        <div class="dynamic-container" > 
          <el-form-item label="郵便番号(数字のみ)" prop="postalCode">
            <el-input v-model="addRow.postalCode" maxlength="32" @blur="formatPostalCode" class="width-zoom-1">
            </el-input>
          </el-form-item>
          <el-form-item label="都道府県" prop="prefecture">
            <elx-select v-model="addRow.prefecture" selectKey="EQ_EMPTY_HOUSE_LOCATION" class="width-zoom-1">
            </elx-select>
          </el-form-item>
          <el-form-item label="以降の住所" prop="address">
            <el-input v-model="addRow.address" maxlength="500" class="width-zoom-2">
            </el-input>
          </el-form-item>
        </div>
        <div class="dynamic-container" >
          <el-form-item label="TEL" prop="tel">
            <el-input v-model="addRow.tel" maxlength="32"
            @blur="formatTelNumber" class="width-zoom-1">
            </el-input>
          </el-form-item>
          <el-form-item label="FAX" prop="fax">
            <el-input v-model="addRow.fax" maxlength="32"
            @blur="formatFaxNumber" class="width-zoom-1">
            </el-input>
          </el-form-item>
          <el-form-item label="担当者携帯" prop="mobile">
            <el-input v-model="addRow.mobile" maxlength="32"
            @blur="formatMobileNumber" class="width-zoom-1">
            </el-input>
          </el-form-item>
        </div>
        <div class="dynamic-container" >
          <el-form-item label="メールアドレス" prop="email">
            <el-input v-model="addRow.email" maxlength="255" class="width-zoom-2">
            </el-input>
          </el-form-item>
          <el-form-item label="ホームページ" prop="homepage">
            <el-input v-model="addRow.homepage" maxlength="255" class="width-zoom-2">
            </el-input>
          </el-form-item>
        </div>
        <div class="dynamic-container" >
          <el-form-item label="対応エリア" prop="serviceArea">
            <elx-select v-model="addRow.serviceArea" selectKey="BIZ_SERVICE_AREA"  class="width-zoom-1" :multiple=true>
            </elx-select>
          </el-form-item>
        <el-form-item label="対応エリア詳細" prop="serviceAreaDetail">
          <elx-select v-model="addRow.serviceAreaDetail" selectKey="EQ_EMPTY_HOUSE_LOCATION"  class="width-zoom-1" :multiple=true>
          </elx-select>
        </el-form-item>
        </div>
        <el-divider></el-divider>
        <div class="dynamic-container" >
          <el-form-item label="提供サービス" prop="providedService" style="width: 100%;">
            <el-input 
              v-model="addRow.providedService" 
              maxlength="500" 
              type="textarea" 
              :autosize="{ minRows: 4, maxRows: 6 }" 
              style="width: 70%;"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dynamic-container" >
          <el-form-item label="メモ" prop="memo" style="width: 100%;">
            <el-input 
              v-model="addRow.memo" 
              maxlength="500" 
              type="textarea" 
              :autosize="{ minRows: 4, maxRows: 6 }" 
              style="width: 70%;"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dynamic-container" >
          <el-form-item label="添付ファイル（会社概要）" prop="attachOverview">
            <el-input v-model="addRow.attachOverview" maxlength="32" class="width-zoom-1">
            </el-input>
          </el-form-item>
          <el-form-item label="添付ファイル（詳細資料）" prop="attachDetail">
            <el-input v-model="addRow.attachDetail" maxlength="32" class="width-zoom-1">
            </el-input>
          </el-form-item>
        </div>
    </el-card>
    <el-card class="el-crd-cls">
      <template #header><span class="card-header">依頼案件</span></template>
      <div class="dynamic-container" >
        <el-form-item label="送客案件リンク" prop="customerCaseLink">
          <el-input v-model="addRow.customerCaseLink" maxlength="255"  class="width-zoom-2">
          </el-input>
        </el-form-item>
      </div>
    </el-card>
    <div class="detail-btn-group-cls">
        <!-- <el-button type="primary" @click="emit('save')" v-show="!isReadOnly" :loading="loadingSave">保存</el-button> -->
        <el-button type="primary" @click="save" :loading="loadingSave">保存する</el-button>
        <el-button @click="emit('close')">閉じる</el-button>
      </div>
  </el-form>
</template>

<script lang="ts" setup>
import {defineProps, defineEmits, reactive, ref} from 'vue';
// import axios from 'axios' // 引入 axios
import {useFetch} from '#app';
import {ElMessage, ElMessageBox} from 'element-plus';
import {onMounted} from "vue";
import type { ComponentSize, FormProps } from 'element-plus'
import '~/assets/css/app.css';

const labelPosition = ref<FormProps['labelPosition']>('top');

/*init fields*/
const loadingSave = ref(false);
const addRowRef = ref();
const {$api} = useNuxtApp()

const addRow = reactive({
  id: "", 
  recordNo: "", 
  recordType: "", 
  partnerRank: "", 
  industry: "", 
  other: "", 
  registrationDate: "", 
  companyName: "", 
  departmentName: "", 
  representativeName: "", 
  position: "", 
  postalCode: "", 
  prefecture: "", 
  address: "", 
  tel: "", 
  fax: "", 
  mobile: "", 
  email: "", 
  homepage: "", 
  serviceArea: "", 
  serviceAreaDetail: "", 
  providedService: "", 
  memo: "", 
  attachOverview: "", 
  attachDetail: "", 
  customerCaseLink: "", 
});

onMounted(() => {
});

const props = defineProps({
  addUrl: String,
});

const emit = defineEmits(['save', 'close']);

const formatTelNumber = () => {
  const numbers = addRow.tel.replace(/[^0-9]/g, '');

  if (numbers.length === 11) {
    // 手机格式，如 090-1234-5678
    addRow.tel = numbers.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
  } else if (numbers.length === 10) {
    if (numbers.startsWith('03') || numbers.startsWith('06')) {
      // 东京都区部、大阪，格式如 03-1234-5678
      addRow.tel = numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '$1-$2-$3');
    } else if (numbers.startsWith('011') || numbers.startsWith('045') || numbers.startsWith('092')) {
      // 北海道、横滨、福冈等地，格式如 011-123-4567
      addRow.tel = numbers.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
    } else {
      // 默认 fallback：3-3-4（不准确但安全）
      addRow.tel = numbers.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
    }
  }
};

const formatMobileNumber = () => {
  if (!addRow.mobile) return;
  
  // 数字のみを抽出
  const numbers = addRow.mobile.replace(/[^0-9]/g, '');
  
  // 11桁の場合のみフォーマット
  if (numbers.length === 11) {
    addRow.mobile = numbers.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
  }
};

const formatFaxNumber = () => {
  const numbers = addRow.fax.replace(/[^0-9]/g, '');
  if (numbers.length === 10) {
    addRow.fax = numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '$1-$2-$3');
  } else if (numbers.length === 11) {
    addRow.fax = numbers.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
  }
};
const formatPostalCode = () => {
  if (!addRow.postalCode) return;
  const numbers = addRow.postalCode.replace(/[^0-9]/g, '');
  if (numbers.length === 7) {
    addRow.postalCode = numbers.slice(0, 3) + '-' + numbers.slice(3);
  }
};

onMounted(() => {
  // 初期表示時のフォーマット処理
  if (addRow.mobile) {
    formatMobileNumber();
  }
  if (addRow.tel) {
    formatTelNumber();
  }
  if (addRow.postalCode) {
    formatPostalCode();
  }
});
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
      body: addRow, 
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
  recordNo: [{required: true, message: 'レコード番号を入力してください ', trigger: 'blur'},],
  email: [{
    required: false,
    type: 'email',
    message: '正しいメールアドレスの形式で入力してください',
    trigger: ['blur', 'change']
  }],
  tel: [{
    required: false,
    pattern: /^(0[1-9]{1}[0-9]{0,1})-([0-9]{4})-([0-9]{4})$|^(090|080|070|060|050|040|030|020|010|000)-([0-9]{4})-([0-9]{4})$|^\+81\s(90|80|70|60|50|40|30|20|10|00)-([0-9]{4})-([0-9]{4})$/,
    message: '正しいTELの形式で入力してください',
    trigger: ['blur', 'change']
  }],
  fax: [{
    required: false,
    pattern: /^(0[1-9]{1}[0-9]{0,1})-([0-9]{4})-([0-9]{4})$|^(090|080|070|060|050|040|030|020|010|000)-([0-9]{4})-([0-9]{4})$|^\+81\s(90|80|70|60|50|40|30|20|10|00)-([0-9]{4})-([0-9]{4})$/,
    message: '正しいFAXの形式で入力してください',
    trigger: ['blur', 'change']
  }],
  mobile: [{
    required: false,
    pattern: /^(0[1-9]{1}[0-9]{0,1})-([0-9]{4})-([0-9]{4})$|^(090|080|070|060|050|040|030|020|010|000)-([0-9]{4})-([0-9]{4})$|^\+81\s(90|80|70|60|50|40|30|20|10|00)-([0-9]{4})-([0-9]{4})$/,
    message: '正しい携帯番号の形式で入力してください',
    trigger: ['blur', 'change']
  }],
  postalCode: [{
    required: false,
    pattern: /^\d{3}-\d{4}$/,
    message: '正しい郵便番号の形式で入力してください',
    trigger: ['blur', 'change']
  }],
};
</script>

<style scoped>
/* 为所有 el-form-item 标签设置左右间距 */
/* .el-form-item {
  margin-left: 2px;
  margin-right: 2px;
  margin-top: 2px; 
  margin-bottom: 2px;
}
.full-width-row {
  display: flex;
  flex-wrap: wrap;
  width: 100%; 
} */
.el-form-item {
  flex: 1; /* 让表单项占满可用空间 */
}
</style>

