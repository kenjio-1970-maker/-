<template>
  <el-card class="el-crd-cls">
    <template #header>
      <span class="card-header">
        <SelectKeyFormatter selectKey="SYS_USER_TYPE" :value="userType" :key="userType" />
      </span>
    </template>
    <el-form ref="formRef" :model="modelValue" :rules="userCardRules">
    <div class="dynamic-container">
      <el-form-item label="雇用状況" prop="employmentStatus">
        <elx-select v-model="modelValue.employmentStatus" selectKey="EMPLOYMENT_STATUS" class="width-zoom-1"
          :disabled="isReadOnly" style="margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="氏名" prop="workerFullName">
        <el-input v-model="modelValue.workerFullName" maxlength="100" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="ひらがな" prop="furigana">
        <el-input v-model="modelValue.furigana" maxlength="100" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="生年月日" prop="birthDate">
        <el-date-picker v-model="modelValue.birthDate" type="date" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-divider content-position="center" style="border: none; margin: 0;" />
      <el-form-item label="入社年月日" prop="joinDate">
        <el-date-picker v-model="modelValue.joinDate" type="date" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="退社年月日" prop="leaveDate">
        <el-date-picker v-model="modelValue.leaveDate" type="date" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-divider content-position="center" style="border: none;" />
      <el-form-item label="郵便番号" prop="postalCode">
        <el-input v-model="modelValue.postalCode" maxlength="32" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="住所" prop="address">
        <el-input v-model="modelValue.address" maxlength="500" class="width-zoom-2" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="最寄り駅" prop="nearestStation">
        <el-input v-model="modelValue.nearestStation" maxlength="300" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-divider content-position="center" style="border: none; margin: 0" />
      <el-form-item label="住まい" prop="residenceType">
        <elx-radio-group v-model="modelValue.residenceType" selectKey="RESIDENCE_TYPE" class="width-zoom"
          :disabled="isReadOnly" style="display: flex; margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="婚姻" prop="maritalStatus">
        <elx-radio-group v-model="modelValue.maritalStatus" selectKey="MARITAL_STATUS" class="width-zoom"
          :disabled="isReadOnly" style="display: flex; margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="家族構成" prop="familyStructure">
        <el-input v-model="modelValue.familyStructure" maxlength="255" class="width-zoom-2" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-divider content-position="center" style="border: none; margin: 0" />
      <el-form-item label="個人携帯" prop="phoneNumber">
        <el-input v-model="modelValue.phoneNumber" maxlength="32" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="個人メールアドレス" prop="emailPersonal">
        <el-input v-model="modelValue.emailPersonal" maxlength="255" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-divider content-position="center" style="border: none; margin: 0" />
      <el-form-item label="会社携帯" prop="companyMobile">
        <el-input v-model="modelValue.companyMobile" maxlength="255" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="gmailメールアドレス" prop="emailGmail">
        <el-input v-model="modelValue.emailGmail" maxlength="255" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="acincメールアドレス" prop="emailCompany">
        <el-input v-model="modelValue.emailCompany" maxlength="255" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="acメアド設定パスワード" prop="acPassword">
        <el-input v-model="modelValue.acPassword" maxlength="250" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-divider content-position="center" style="border: none; margin: 0" />
      <el-form-item label="緊急連絡先">
        <el-table :data="modelValue.emergencyList || []" border style="margin-top: 10px; width: auto">
          <el-table-column label="実家住所" prop="homeAddress" width="400">
            <template #default="scope">
              <el-input v-model="scope.row.homeAddress" maxlength="500" class="width-zoom-2" :disabled="isReadOnly" />
            </template>
          </el-table-column>
          <el-table-column label="氏名" prop="contactName" width="210">
            <template #default="scope">
              <el-input v-model="scope.row.contactName" maxlength="100" class="width-zoom-1" :disabled="isReadOnly" />
            </template>
          </el-table-column>
          <el-table-column label="連絡先" prop="contactPhone" width="210">
            <template #default="scope">
              <el-input v-model="scope.row.contactPhone" maxlength="255" class="width-zoom-1" :disabled="isReadOnly" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button type="danger" size="small" @click="removeEmergencyContact(scope.$index)"
                :disabled="isReadOnly">
                削除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-divider content-position="center" style="border: none; margin: 0" />
        <div style="margin-top: 10px;" v-if="!isReadOnly">
          <el-button type="primary" @click="addEmergencyContact" size="small">
            連絡先を追加
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="勤務可能曜日（基本）" prop="availableDays">
        <elx-checkbox-group v-model="modelValue.availableDays" selectKey="AVAILABLE_DAYS" class="width-zoom"
          :disabled="isReadOnly" style="display: flex; margin-top: 5px;" />
      </el-form-item>
      <el-divider content-position="center" style="border: none; margin: 0" />
      <el-form-item label="ACが本業か？" prop="isAcMainJob">
        <elx-radio-group v-model="modelValue.isAcMainJob" selectKey="IS_AC_MAIN_JOB" class="width-zoom"
          :disabled="isReadOnly" style="display: flex; margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="不動産業務経験" prop="estateExp">
        <elx-radio-group v-model="modelValue.estateExp" selectKey="ESTATE_EXP" class="width-zoom"
          :disabled="isReadOnly" style="display: flex; margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="保有資格" prop="quals">
        <el-input v-model="modelValue.quals" type="textarea" maxlength="1000" class="width-zoom-1"
          :disabled="isReadOnly" style="margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="備考" prop="remarks">
        <el-input v-model="modelValue.remarks" type="textarea" maxlength="1000" class="width-zoom-1"
          :disabled="isReadOnly" style="margin-top: 5px;" />
      </el-form-item>
      <el-divider content-position="center" style="border: none; margin: 0" />
      <el-form-item label="PC有無" prop="hasPc">
        <elx-checkbox-group v-model="modelValue.hasPc" selectKey="HAS_PC" class="width-zoom" :disabled="isReadOnly"
          style="display: flex; margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="Wi-Fi環境" prop="wifiEnvironment">
        <el-input v-model="modelValue.wifiEnvironment" maxlength="32" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-divider content-position="center" />
      <span style="font-size: 16px; color: black; font-weight: bold;">インターン</span>
      <el-divider content-position="center" style="border: none;" />
      <el-form-item label="大学" prop="university">
        <el-input v-model="modelValue.university" maxlength="255" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="学科／専攻／学年" prop="departmentInfo">
        <el-input v-model="modelValue.departmentInfo" maxlength="255" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="卒業予定年度" prop="graduationYear">
        <el-input v-model="modelValue.graduationYear" maxlength="32" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="通学定期" prop="studentPass">
        <elx-radio-group v-model="modelValue.studentPass" selectKey="STUDENT_PASS_ARRAY" class="width-zoom"
          :disabled="isReadOnly" style="display: flex; margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="有の場合、区間" prop="commuteSection">
        <el-input v-model="modelValue.commuteSection" maxlength="100" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-divider content-position="center" />
      <span style="font-size: 16px; color: black; font-weight: bold;">貸出PC情報</span>
      <el-divider content-position="center" style="border: none;" />
      <el-form-item label="PC社内管理番号" prop="pcInternalId">
        <el-input v-model="modelValue.pcInternalId" maxlength="100" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="PCアカウント名" prop="pcAccountName">
        <el-input v-model="modelValue.pcAccountName" maxlength="100" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="ログインパス" prop="loginPassword">
        <el-input v-model="modelValue.loginPassword" maxlength="36" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="貸出付与年月" prop="pcGrantDate">
        <el-date-picker v-model="modelValue.pcGrantDate" type="date" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="PC返却日" prop="pcReturnDate">
        <el-date-picker v-model="modelValue.pcReturnDate" type="date" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-divider content-position="center" style="border: none; margin: 0" />
      <!-- TODO: 画像のアップロード機能を実装する -->
      <el-form-item label="PC情報のスクショ" prop="pcScreenshotList" v-if="modelValue.id">
        <FileUpload 
          v-model:file-list="pcScreenshotListArray" 
          :disabled="isReadOnly"
          :upload-url="'/sys/user/worker/screenshot'"
          :extra-form-data="[{ key: 'workerId', value: props.modelValue.id }]" 
          :preview-url="'download'" :limit="5"
          :max-size-m-b="10"
          :enableGlobalDrop="true" />
      </el-form-item>
      <el-form-item label="PC情報のスクショ" v-else>
        <div style="border: 1px solid #dcdfe6; padding: 0 10px; margin: 5px 0 0; border-radius: 4px;">
          ワーカー情報が存在しません。該当情報を保存してから
          <br />スクリーンショットをアップロードしてください。
        </div>
      </el-form-item>
      <el-form-item label="備考２" prop="remarks2">
        <el-input v-model="modelValue.remarks2" type="textarea" maxlength="1000" class="width-zoom-1"
          :disabled="isReadOnly" style="margin-top: 5px;" />
      </el-form-item>
      <el-divider content-position="center" />
      <span style="font-size: 16px; color: black; font-weight: bold;">給与口座情報</span>
      <el-divider content-position="center" style="border: none;" />
      <el-form-item label="金融機関名" prop="bankName">
        <el-input v-model="modelValue.bankName" maxlength="255" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="支店名" prop="branchName">
        <el-input v-model="modelValue.branchName" maxlength="255" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="預金種類" prop="depositType">
        <elx-radio-group v-model="modelValue.depositType" selectKey="DEPOSIT_TYPE" :disabled="isReadOnly"
          groupName="gtpName2" class="width-zoom" style="display: flex; margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="口座番号" prop="accountNumber">
        <el-input v-model="modelValue.accountNumber" maxlength="100" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-divider content-position="center" style="border: none; margin: 0" />
      <el-form-item label="口座名義名（カナ）" prop="accountHolderKana">
        <el-input v-model="modelValue.accountHolderKana" maxlength="100" class="width-zoom-1" :disabled="isReadOnly"
          style="margin-top: 5px;" />
      </el-form-item>
      <el-form-item label="所得税納税者区分" prop="incomeTaxCategory">
        <elx-radio-group v-model="modelValue.incomeTaxCategory" selectKey="INCOME_TAX_CATEGORY" :disabled="isReadOnly"
          groupName="gtpName2" class="width-zoom" style="display: flex; margin-top: 5px;" />
      </el-form-item>
      <el-divider content-position="center" />
      <span style="font-size: 16px; color: black; font-weight: bold;">配属・異動の記録</span>
      <el-divider content-position="center" style="border: none;" />
      <el-form-item>
        <el-table :data="modelValue.transfersList || []" border style="margin-top: 10px; width: auto">
          <el-table-column label="日付" prop="actionDate" width="300">
            <template #default="scope">
              <el-date-picker v-model="scope.row.actionDate" type="date" class="width-zoom-1" :disabled="isReadOnly"
                style="margin-top: 5px;" />
            </template>
          </el-table-column>
          <el-table-column label="配属・異動内容" prop="transferDetails" width="400">
            <template #default="scope">
              <el-input v-model="scope.row.transferDetails" maxlength="500" class="width-zoom-2"
                :disabled="isReadOnly" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button type="danger" size="small" @click="removeTransfersRecord(scope.$index)" :disabled="isReadOnly">
                削除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-divider content-position="center" style="border: none; margin: 0" />
        <div style="margin-top: 10px;" v-if="!isReadOnly">
          <el-button type="primary" @click="addTransfersRecord" size="small">
            記録を追加
          </el-button>
        </div>
      </el-form-item>
    </div>
  </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, defineExpose } from 'vue';
import SelectKeyFormatter from "@/components/ElxColumnSelectKey.vue";
import type { UploadUserFile, UploadStatus } from 'element-plus'
import { userCardRules } from '@/utils/validationRules'; // Import the validation rules


const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  userType: {
    type: String,
    required: true
  },
  isReadOnly: {
    type: Boolean,
    default: false
  }
});


interface ScreenshotFile {
  fileName: string
  fileUrl: string
  fileId: string
}
// pcScreenshotList文字列をチェックボックス・グループ用の配列に変換する
const pcScreenshotListArray = computed({
  get: () => {
    const files = props.modelValue.pcScreenshotList || [];
    
    return files.map(file => ({
      name: file.fileName,
      url: file.fileUrl,
      fileId: file.fileId,
      uid: file.fileId,
      status: 'success'
    }));
  },
  set: (newList) => {
    props.modelValue.pcScreenshotList = (newList || []).map((file) => ({
      fileName: file.name,
      fileUrl: file.url,
      fileId: file.fileId
    }));
    emit('update:modelValue', props.modelValue);
  }
});

const emit = defineEmits(['update:modelValue']);

if (!props.modelValue.emergencyList) {
  props.modelValue.emergencyList = [];
}

if (!props.modelValue.transfersList) {
  props.modelValue.transfersList = [];
}

if (!props.modelValue.pcScreenshotList) {
  props.modelValue.pcScreenshotList = [];
}

const addEmergencyContact = () => {
  if (!props.modelValue.emergencyList) {
    props.modelValue.emergencyList = [];
  }

  props.modelValue.emergencyList.push({
    homeAddress: '',
    contactName: '',
    contactPhone: ''
  });

  props.modelValue.emergencyList = [...props.modelValue.emergencyList];
  emit('update:modelValue', props.modelValue);
};

const removeEmergencyContact = (index: number) => {
  props.modelValue.emergencyList.splice(index, 1);
  props.modelValue.emergencyList = [...props.modelValue.emergencyList];
  emit('update:modelValue', props.modelValue);
};

const addTransfersRecord = () => {
  if (!props.modelValue.transfersList) {
    props.modelValue.transfersList = [];
  }

  props.modelValue.transfersList.push({
    actionDate: '',
    transferDetails: ''
  });

  props.modelValue.transfersList = [...props.modelValue.transfersList];
  emit('update:modelValue', props.modelValue);
};

const removeTransfersRecord = (index: number) => {
  props.modelValue.transfersList.splice(index, 1);
  props.modelValue.transfersList = [...props.modelValue.transfersList];
  emit('update:modelValue', props.modelValue);
};

const formRef = ref(); // 引用表单

// 提供校验方法
const validateField = async (field: string) => {
  try {
    await formRef.value.validateField(field);
    return true;
  } catch (error) {
    return false;
  }
};

const validateAll = async () => {  
  try {
    await formRef.value.validate();
    return true;
  } catch (error) {
    return false;
  }
};

// 暴露方法给父组件
defineExpose({
  validateField,
  validateAll
});
</script>
