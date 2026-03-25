<template>
  <el-form 
  label-width="80px" 
  :model="detailRow" 
  :rules="rules" 
  :label-position="labelPosition"
  :inline="true" 
  ref="updRowRef">

    <el-card class="el-crd-cls">
      <template #header><span class="card-header">基本情報</span></template>
      <div class="dynamic-container" >
          <el-form-item label="レコード番号" prop="recordNo">
            <el-input  v-model="detailRow.recordNo"
              maxlength="100" 
              class="width-zoom-1"
              :disabled="isReadOnly">
            </el-input>
          </el-form-item>
          <el-form-item label="レコードタイプ" prop="recordType">
            <elx-checkbox-group v-model="detailRow.recordType" 
              selectKey="BIZ_RECORD_TYPE" 
              groupName="gtpName"
              class="width-zoom-1"
              :disabled="isReadOnly">
            </elx-checkbox-group>
          </el-form-item>
        </div>
        <div class="dynamic-container" >
          <el-form-item label="協力業者ランク" prop="partnerRank">
            <elx-select v-model="detailRow.partnerRank" selectKey="BIZ_PARTNER_RANK" class="width-zoom-1" :disabled="isReadOnly">
            </elx-select>
          </el-form-item>
          <el-form-item label="業種" prop="industry">
            <elx-select v-model="detailRow.industry" selectKey="BIZ_INDUSTRY" class="width-zoom-1" :disabled="isReadOnly">
            </elx-select>
          </el-form-item>
          <el-form-item label="その他" prop="other">
            <el-input v-model="detailRow.other" maxlength="100" class="width-zoom-1" :disabled="isReadOnly">
            </el-input>
          </el-form-item>
          <el-form-item label="登録日" prop="registrationDate">
            <el-date-picker v-model="detailRow.registrationDate" type="date" style="width: var(--width-zoom-1);" :disabled="isReadOnly">
            </el-date-picker>
          </el-form-item>
        
      </div>
    </el-card>

    <el-card class="el-crd-cls">
      <template #header><span class="card-header">企業概要</span></template>
        <div class="dynamic-container" >
          <el-form-item label="会社名" prop="companyName">
            <el-input v-model="detailRow.companyName" class="width-zoom-1" maxlength="255" :disabled="isReadOnly">
            </el-input>
          </el-form-item>
          <el-form-item label="部署名" prop="departmentName">
            <el-input v-model="detailRow.departmentName" class="width-zoom-1" maxlength="255" :disabled="isReadOnly">
            </el-input>
          </el-form-item>
          <el-form-item label="担当者名" prop="representativeName">
            <el-input v-model="detailRow.representativeName" class="width-zoom-1" maxlength="255" :disabled="isReadOnly">
            </el-input>
          </el-form-item>
          <el-form-item label="役職" prop="position">
            <el-input v-model="detailRow.position" class="width-zoom-1" maxlength="80" :disabled="isReadOnly">
            </el-input>
          </el-form-item>
        </div>
        <div class="dynamic-container" >
          <el-form-item label="郵便番号(数字のみ)" prop="postalCode">
            <el-input v-model="detailRow.postalCode" class="width-zoom-1" @blur="formatPostalCode" maxlength="32" :disabled="isReadOnly">
            </el-input>
          </el-form-item>
          <el-form-item label="都道府県" prop="prefecture">
            <elx-select v-model="detailRow.prefecture" selectKey="EQ_EMPTY_HOUSE_LOCATION" class="width-zoom-1" :disabled="isReadOnly">
            </elx-select>
          </el-form-item>
          <el-form-item label="以降の住所" prop="address">
            <el-input v-model="detailRow.address" class="width-zoom-2" maxlength="500" :disabled="isReadOnly">
            </el-input>
          </el-form-item>
        </div>
        <div class="dynamic-container" >
          <el-form-item label="TEL" prop="tel">
            <el-input v-model="detailRow.tel" class="width-zoom-1"
            @blur="formatTelNumber" maxlength="32" :disabled="isReadOnly">
            </el-input>
          </el-form-item>
          <el-form-item label="FAX" prop="fax">
            <el-input v-model="detailRow.fax" class="width-zoom-1"
            @blur="formatFaxNumber" maxlength="32" :disabled="isReadOnly">
            </el-input>
          </el-form-item>
          <el-form-item label="担当者携帯" prop="mobile">
            <el-input v-model="detailRow.mobile" class="width-zoom-1"
            @blur="formatMobileNumber" maxlength="32" :disabled="isReadOnly">
            </el-input>
          </el-form-item>
        </div>
        <div class="dynamic-container" >
          <el-form-item label="メールアドレス" prop="email">
            <el-input v-model="detailRow.email" class="width-zoom-2" maxlength="255" :disabled="isReadOnly">
            </el-input>
          </el-form-item>
          <el-form-item label="ホームページ" prop="homepage">
            <el-input v-model="detailRow.homepage" class="width-zoom-2" maxlength="255" :disabled="isReadOnly">
            </el-input>
          </el-form-item>
        </div>
        <div class="dynamic-container" >
          <el-form-item label="対応エリア" prop="serviceArea">
            <elx-select v-model="detailRow.serviceArea" 
              selectKey="BIZ_SERVICE_AREA" 
              class="width-zoom-1"
              :disabled="isReadOnly"
              :multiple=true
              >
            </elx-select>
          </el-form-item>
        <el-form-item label="対応エリア詳細" prop="serviceAreaDetail">
          <elx-select v-model="detailRow.serviceAreaDetail"
           selectKey="EQ_EMPTY_HOUSE_LOCATION"
           class="width-zoom-1"
           :disabled="isReadOnly"
           :multiple=true>
          </elx-select>
        </el-form-item>
        </div>
        <div class="dynamic-container" >
          <el-form-item label="提供サービス" prop="providedService" style="width: 100%;">
            <el-input 
              v-model="detailRow.providedService" 
              maxlength="500" 
              type="textarea" 
              :disabled="isReadOnly"
              :autosize="{ minRows: 4, maxRows: 6 }" 
              style="width: 70%;"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dynamic-container" >
          <el-form-item label="メモ" prop="memo" style="width: 100%;">
            <el-input 
              v-model="detailRow.memo" 
              maxlength="500" 
              type="textarea" 
              :disabled="isReadOnly"
              :autosize="{ minRows: 4, maxRows: 6 }" 
              style="width: 70%;"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dynamic-container" >
          <el-form-item label="添付ファイル（会社概要）" prop="attachOverview">
            <el-input v-model="detailRow.attachOverview" class="width-zoom-1" maxlength="32" :disabled="isReadOnly">
            </el-input>
          </el-form-item>
          <el-form-item label="添付ファイル（詳細資料）" prop="attachDetail">
            <el-input v-model="detailRow.attachDetail" class="width-zoom-1" maxlength="32" :disabled="isReadOnly">
            </el-input>
          </el-form-item>
        </div>
    </el-card>
    <el-card class="el-crd-cls">
      <template #header><span class="card-header">依頼案件</span></template>
      <div class="dynamic-container" >
        <el-form-item label="送客案件リンク" prop="customerCaseLink">
          <el-input v-model="detailRow.customerCaseLink" 
            maxlength="255" 
            :disabled="isReadOnly"
            class="width-zoom-2">
          </el-input>
        </el-form-item>
      </div>
    </el-card>
    
 <!-- <el-card class="el-crd-cls">
      <template #header><span class="card-header">臨時按鈕</span></template>
      <div class="dynamic-container" >
        <el-form-item label="作成者" prop="createUser"><el-input v-model="detailRow.createUser" placeholder="作成者を入力してください" maxlength="32"></el-input></el-form-item>
        <el-form-item label="更新者" prop="updateUser"><el-input v-model="detailRow.updateUser" placeholder="更新者を入力してください" maxlength="32"></el-input></el-form-item>
        <el-form-item label="作成時間" prop="createAt"><el-input v-model="detailRow.createAt" placeholder="作成時間を入力してください" ></el-input></el-form-item>
        <el-form-item label="更新時間" prop="updateAt"><el-input v-model="detailRow.updateAt" placeholder="更新時間を入力してください" ></el-input></el-form-item>
      </div>
    </el-card> -->
    
    <div class="detail-btn-group-cls">
        <!-- <el-button type="primary" @click="emit('save')" v-show="!isReadOnly" :loading="loadingSave">保存</el-button> -->
        <el-button type="primary" @click="save" v-show="!isReadOnly" :loading="loadingSave">保存する</el-button>
        <el-button @click="emit('close')">閉じる</el-button>
      </div>
        
  </el-form>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, reactive, ref, onMounted } from 'vue';
// import axios from 'axios' // 引入 axios
import { useFetch } from '#app'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import '~/assets/css/app.css';
import type { ComponentSize, FormProps } from 'element-plus'

const labelPosition = ref<FormProps['labelPosition']>('top');

// const isReadOnly = ref(true);
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

// const formatTelNumber = () => {
//   const numbers = props.detailRow.tel.replace(/[^0-9]/g, '');
//   if (numbers.length === 10) {
//     props.detailRow.tel = numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '$1-$2-$3');
//   } else if (numbers.length === 11) {
//     props.detailRow.tel = numbers.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
//   }
// };

const formatTelNumber = () => {
  const numbers = props.detailRow.tel.replace(/[^0-9]/g, '');

  if (numbers.length === 11) {
    // 手机格式，如 090-1234-5678
    props.detailRow.tel = numbers.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
  } else if (numbers.length === 10) {
    if (numbers.startsWith('03') || numbers.startsWith('06')) {
      // 东京都区部、大阪，格式如 03-1234-5678
      props.detailRow.tel = numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '$1-$2-$3');
    } else if (numbers.startsWith('011') || numbers.startsWith('045') || numbers.startsWith('092')) {
      // 北海道、横滨、福冈等地，格式如 011-123-4567
      props.detailRow.tel = numbers.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
    } else {
      // 默认 fallback：3-3-4（不准确但安全）
      props.detailRow.tel = numbers.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
    }
  }
};

const formatMobileNumber = () => {
  if (!props.detailRow.mobile) return;
  
  // 数字のみを抽出
  const numbers = props.detailRow.mobile.replace(/[^0-9]/g, '');
  
  // 11桁の場合のみフォーマット
  if (numbers.length === 11) {
    props.detailRow.mobile = numbers.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
  }
};
const formatPostalCode = () => {
  if (!props.detailRow.postalCode) return;
  const numbers = props.detailRow.postalCode.replace(/[^0-9]/g, '');
  if (numbers.length === 7) {
    props.detailRow.postalCode = numbers.slice(0, 3) + '-' + numbers.slice(3);
  }
};

const formatFaxNumber = () => {
  const numbers = props.detailRow.fax.replace(/[^0-9]/g, '');
  if (numbers.length === 10) {
    props.detailRow.fax = numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '$1-$2-$3');
  } else if (numbers.length === 11) {
    props.detailRow.fax = numbers.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
  }
};

onMounted(() => {
  // 初期表示時のフォーマット処理
  if (props.detailRow.mobile) {
    formatMobileNumber();
  }
  if (props.detailRow.tel) {
    formatTelNumber();
  }
  if (props.detailRow.fax) {
    formatFaxNumber();
  }
  if (props.detailRow.postalCode) {
    formatPostalCode();
  }
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
    const response = await $api(props.editUrl, {
      method: 'PUT',
      headers: { "Content-Type": "application/json"
       },
      body: JSON.stringify(props.detailRow)
    })
    console.log("Response data:", response);

    if (response.success) {
      emit('save', response);
      return;
    }
    ElMessage({type: 'error', message: response.msg, style: 'z-index: 3000;'});
  } catch (error) {
    ElMessage({type: 'error', message: 'Failed to retrieve data: ' + error, style: 'z-index: 3000;'});

  }finally {
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

/* const open4 = () => {
  ElNotification.error({
    title: '错误',
    message: '这是一条错误的提示消息',
  });
}; */

</script>

<style scoped>
/* 如果需要样式，请在这里添加 */

/* 确保 el-card 不遮挡 ElNotification */
/* .el-crd-cls {
  position: relative;
  z-index: auto;
} */
/* .el-form-item {
  margin-left: 2px;
  margin-right: 2px;
  margin-top: 2px; 
  margin-bottom: 2px;
} */
/* .full-width-row {
  display: flex;
  flex-wrap: wrap;
  width: 100%; 
} */
.el-form-item {
  flex: 1; /* 让表单项占满可用空间 */
}
</style>

