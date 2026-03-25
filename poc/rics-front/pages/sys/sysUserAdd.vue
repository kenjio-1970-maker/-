<template>
  <el-form label-width="80px" :rules="sysUserRules" 
  :label-position="labelPosition"
  :inline="true" 
  ref="formRef"
  :model="{...base, ...detail}"
  :validate-on-rule-change="false">
    <el-card class="el-crd-cls">
      <template #header><span class="card-header">基本情報</span></template>
      <div class="dynamic-container">
        <el-form-item label="ユーザーID" prop="fullName">
          <el-input v-model="base.fullName" maxlength="50" class="width-zoom-1">
          </el-input>
        </el-form-item>
        <el-form-item label="パスワード" prop="userPasswd">
          <el-input v-model="base.userPasswd" maxlength="30" class="width-zoom-1" type="password" show-password>
          </el-input>
        </el-form-item> 
        <div class="full-width-row">
          <el-form-item label="ユーザー区分" prop="userType">
            <elx-select v-model="base.userType" selectKey="SYS_USER_TYPE" class="width-zoom-1">
            </elx-select>
          </el-form-item>
        </div>
      </div>
    </el-card>

    <!-- CT/CTマスタ -->
    <consul-info-card
      v-if="['1', '2'].includes(base.userType)"
      v-model="consul"
      :userType="base.userType"
      :is-read-only="false"
      ref="consulCardRef"
    />

    <!-- ワーカー/スーパーワーカー -->
    <worker-info-card 
      v-if="['3', '4'].includes(base.userType)" 
      v-model="worker" 
      :userType="base.userType"
      :is-read-only="false"
      ref="workerCardRef"
    />

    <!-- Customer Card - Using the component -->
    <customer-info-card
      v-if="base.userType === '5'"
      v-model="detail"
      :userType="base.userType"
      :is-read-only="false"
      ref="customerCardRef"
    />

    <div class="detail-btn-group-cls">
        <el-button type="primary" @click="save" :loading="loadingSave">保存する</el-button>
        <el-button @click="closeForm" >閉じる</el-button>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus'
import type { FormProps } from 'element-plus'
import WorkerInfoCard from "@/components/user/WorkerInfoCard.vue";
import ConsulInfoCard from "@/components/user/ConsulInfoCard.vue";
import CustomerInfoCard from "@/components/user/CustomerInfoCard.vue";
import { fa } from 'element-plus/es/locale/index.mjs';
import { sysUserRules } from '@/utils/validationRules'; // Import the validation rules

const labelPosition = ref<FormProps['labelPosition']>('top');

/*init fields*/
const loadingSave = ref(false);
const formRef = ref();
const consulCardRef = ref(); // consulCardRef を定義
const workerCardRef = ref(); // workerCardRef を定義
const customerCardRef = ref(); // customerCardRef を定義
const {$api} = useNuxtApp();

const base = ref({
  fullName: '',
  userPasswd: '',
  email: '',
  userType: ''
});
const consul = ref({});
const worker = ref({});
const detail = ref({});

const props = defineProps({
  addUrl: String,
});

const emit = defineEmits(['save', 'close']);

const save = async () => {
  try {

    let isCardValid = false;
    if (base.value.userType === '1' || base.value.userType === '2') {
      isCardValid = await consulCardRef.value.validateAll().catch(() => false);
    } else if (base.value.userType === '3' || base.value.userType === '4') {
      isCardValid = await workerCardRef.value.validateAll().catch(() => false);
    } else if (base.value.userType === '5') {
      isCardValid = await customerCardRef.value.validateAll().catch(() => false);
    }

    const valid = await formRef.value.validate().catch(() => false);
    if (!valid || !isCardValid) return;

    loadingSave.value = true;
    const response = await useNuxtApp().$api(props.addUrl, {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: {
        base: base.value,
        consul: consul.value,
        worker: worker.value,
        detail: detail.value
      }
    });
    if (response && response.fail){
      ElMessage({type: 'error', message: response.msg, style: 'z-index: 3000;'});
      return;
    }
    clearForm();
    emit('save', response);
  } catch (error) {
    ElMessage({type: 'error', message: 'エラーが発生しました: ' + error, style: 'z-index: 3000;'});
  } finally {
    loadingSave.value = false;
  }
};

const clearForm = () => {
  base.value = {
    fullName: '',
    userPasswd: '',
    email: '',
    userType: ''
  };
  consul.value = {};
  worker.value = {};
  detail.value = {};

  console.log("clearForm", base.value, consul.value, worker.value, detail.value);
  // 调用 el-form 的 resetFields 方法重置表单
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

const closeForm=async()=> {
  clearForm();
  emit('close');
};

</script>