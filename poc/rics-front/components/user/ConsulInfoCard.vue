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
        <el-form-item label="氏名" prop="consulFullName">
          <el-input v-model="modelValue.consulFullName" maxlength="100" class="width-zoom-1" :disabled="isReadOnly" style="margin-top: 5px;"/>
        </el-form-item>
        <el-form-item label="ひらがな" prop="furigana">
          <el-input v-model="modelValue.furigana" maxlength="100" class="width-zoom-1" :disabled="isReadOnly" style="margin-top: 5px;"/>
        </el-form-item>
        <el-divider content-position="center" style="border: none; margin: 0;"/>
        <el-form-item label="会社名" prop="companyName">
          <el-input v-model="modelValue.companyName" maxlength="200" class="width-zoom-1" :disabled="isReadOnly" style="margin-top: 5px;"/>
        </el-form-item>
        <el-form-item label="郵便番号" prop="postalCode">
          <el-input v-model="modelValue.postalCode" maxlength="10" class="width-zoom-1" :disabled="isReadOnly" style="margin-top: 5px;"/>
        </el-form-item>
        <el-divider content-position="center" style="border: none; margin: 0;"/>
        <el-form-item label="住所" prop="address">
          <el-input v-model="modelValue.address" maxlength="255" class="width-zoom-2" :disabled="isReadOnly" style="margin-top: 5px;"/>
        </el-form-item>
        <el-divider content-position="center" style="border: none; margin: 0;"/>
        <el-form-item label="電話番号" prop="phoneNumber">
          <el-input v-model="modelValue.phoneNumber" maxlength="20" class="width-zoom-1" :disabled="isReadOnly" style="margin-top: 5px;"/>
        </el-form-item>
        <el-form-item label="メールアドレス" prop="consulEmail">
          <el-input v-model="modelValue.consulEmail" maxlength="255" class="width-zoom-1" :disabled="isReadOnly" style="margin-top: 5px;"/>
        </el-form-item>
        <el-divider content-position="center" style="border: none; margin: 0;"/>
        <el-form-item label="前職会社名" prop="prevCompany">
          <el-input v-model="modelValue.prevCompany" maxlength="200" class="width-zoom-1" :disabled="isReadOnly" style="margin-top: 5px;"/>
        </el-form-item>
        <el-form-item label="経験業務" prop="workExperience">
          <el-input v-model="modelValue.workExperience" maxlength="1000" class="width-zoom-2" :disabled="isReadOnly" style="margin-top: 5px;"/>
        </el-form-item>
        <el-divider content-position="center" style="border: none; margin: 0;"/>
        <el-form-item label="保有資格" prop="quals">
          <el-input v-model="modelValue.quals" maxlength="1000" class="width-zoom-3" :disabled="isReadOnly" style="margin-top: 5px;"/>
        </el-form-item>
        <el-divider content-position="left" style="margin: 15px 0; ">サポート担当情報</el-divider>
        <el-form-item label="サテライトオフィス担当" prop="satOfficer" style="margin-top: 15px;">
          <el-input v-model="modelValue.satOfficer" maxlength="1000" class="width-zoom-2" :disabled="isReadOnly" style="margin-top: 5px;"/>
        </el-form-item>
        <el-divider content-position="center" style="border: none; margin: 0;" />
        <el-form-item label="コンサルタント委託契約日" prop="contractDate">
          <el-date-picker v-model="modelValue.contractDate" type="date" class="width-zoom-1" :disabled="isReadOnly" style="margin-top: 5px;"/>
        </el-form-item>
        <el-form-item label="終了日" prop="endDate">
          <el-date-picker v-model="modelValue.endDate" type="date" class="width-zoom-1" :disabled="isReadOnly" style="margin-top: 5px;"/>
        </el-form-item>
        <el-divider content-position="center" style="border: none; margin: 0;"/>
        <el-form-item label="備考" prop="remarks">
          <el-input v-model="modelValue.remarks" maxlength="1000" class="width-zoom-2" :disabled="isReadOnly" style="margin-top: 5px;"/>
        </el-form-item>
      </div>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, defineExpose } from 'vue';
import  SelectKeyFormatter  from "@/components/ElxColumnSelectKey.vue";
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
