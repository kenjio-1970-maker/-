<template>
  <el-card class="el-crd-cls">
    <template #header>
      <span class="card-header">
        <SelectKeyFormatter
          selectKey="SYS_USER_TYPE"
          :value="userType"
          :key="userType"
        />
      </span>
    </template>
    <el-form ref="formRef" :model="modelValue" :rules="userCardRules">
    <div class="dynamic-container">
      <el-form-item label="対応状況" prop="operatingStatus">
        <elx-select v-model="modelValue.operatingStatus" selectKey="OPERATING_STATUS" class="width-zoom-1" :disabled="isReadOnly" style="margin-top: 5px;"/>
      </el-form-item>
      <el-divider content-position="center" style="border: none; margin: 0"/>
      <!--<el-form-item label="企業ID" prop="companyId">
        <el-input v-model="modelValue.companyId" maxlength="32" class="width-zoom-1" :disabled="isReadOnly" style="margin-top: 5px;"/>
      </el-form-item>-->
      <el-form-item label="企業名/店舗名" prop="companyOrStoreName">
        <el-input v-model="modelValue.companyOrStoreName" maxlength="100" class="width-zoom-1" :disabled="isReadOnly" style="margin-top: 5px;"/>
      </el-form-item>
      <el-form-item label="アキコンID" prop="companyOrStoreMark">
        <el-input v-model="modelValue.companyOrStoreMark" maxlength="10" class="width-zoom-1" :disabled="isReadOnly" style="margin-top: 5px;"/>
      </el-form-item>
      <!-- <el-form-item label="企業/店舗ID" prop="companyOrStoreId" hidden>
        <el-input v-model="modelValue.companyOrStoreId" maxlength="100" class="width-zoom-1" :disabled="isReadOnly" style="margin-top: 5px;" />
      </el-form-item> -->
      <el-divider content-position="center" style="border: none; margin: 0"/>
      <!--<el-form-item label="アキコンログインE-mail" prop="detailEmail">
        <el-input v-model="modelValue.detailEmail" maxlength="320" class="width-zoom-1" :disabled="isReadOnly" style="margin-top: 5px;"/>
      </el-form-item>-->
      <el-divider content-position="center" style="border: none; margin: 0"/>
      <el-form-item label="担当者名" prop="staffName">
        <el-input v-model="modelValue.staffName" maxlength="100" class="width-zoom-1" :disabled="isReadOnly" style="margin-top: 5px;"/>
      </el-form-item>
      <el-divider content-position="center" style="border: none; margin: 0;"/>
      <!--<el-form-item label="ひらがな" prop="furigana">
        <el-input v-model="modelValue.furigana" maxlength="255" class="width-zoom-1" :disabled="isReadOnly" style="margin-top: 5px;"/>
      </el-form-item>-->
      <el-form-item label="郵便番号" prop="postalCode">
        <el-input v-model="modelValue.postalCode" maxlength="7" class="width-zoom-1" :disabled="isReadOnly" style="margin-top: 5px;"/>
      </el-form-item>
      <el-form-item label="導入先住所" prop="installationAddress">
        <el-input v-model="modelValue.installationAddress" maxlength="255" class="width-zoom-2" :disabled="isReadOnly" style="margin-top: 5px;"/>
      </el-form-item>
      <el-divider content-position="center" style="border: none; margin: 0;"/>
      <el-form-item label="担当者メールアドレス" prop="staffEmail">
        <el-input v-model="modelValue.staffEmail" maxlength="100" class="width-zoom-1" :disabled="isReadOnly" style="margin-top: 5px;"/>
      </el-form-item>
      <el-form-item label="担当者連絡先" prop="staffContact">
        <el-input v-model="modelValue.staffContact" maxlength="32" class="width-zoom-1" :disabled="isReadOnly" style="margin-top: 5px;"/>
      </el-form-item>
      <el-divider content-position="center" style="border: none; margin: 0;"/>
      <el-form-item label="備考" prop="remarks">
        <el-input v-model="modelValue.remarks" maxlength="255" class="width-zoom-2" :disabled="isReadOnly" style="margin-top: 5px;"/>
      </el-form-item>
      <el-form-item label="社内担当者" prop="internalStaff">
        <el-input v-model="modelValue.internalStaff" maxlength="32" class="width-zoom-1" :disabled="isReadOnly" style="margin-top: 5px;"/>
      </el-form-item>
    </div>
  </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, defineExpose } from 'vue';
import SelectKeyFormatter from "@/components/ElxColumnSelectKey.vue";
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

const emit = defineEmits(['update:modelValue']);
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
