<template>
  <el-form v-if="!isLoading"
  label-width="80px" :rules="sysUserRules" 
  :label-position="labelPosition"
  :inline="true" 
  ref="formRef"
  :model="{...base, ...detail}"
  :validate-on-rule-change="false">

    <el-card class="el-crd-cls">
      <template #header><span class="card-header">基本情報</span></template>
      <div class="dynamic-container">
        <el-form-item label="ユーザーID" prop="fullName">
          <el-input v-model="base.fullName" maxlength="50" class="width-zoom-1" :disabled="isReadOnly">
          </el-input>
        </el-form-item>
        <el-form-item label="パスワード" prop="userPasswd">
          <el-input v-model="base.userPasswd" maxlength="100" class="width-zoom-1" type="password" :disabled="isReadOnly">
          </el-input>
        </el-form-item>
        <div class="full-width-row">
          <el-form-item label="ユーザー区分" prop="userType">
            <elx-select v-model="base.userType" selectKey="SYS_USER_TYPE" class="width-zoom-1" :disabled="true">
            </elx-select>
          </el-form-item>
        </div>
        <div class="full-width-row" v-if="!isReadOnly">
          <el-form-item  prop="ResetPwd">            
            <el-button type="primary" @click="resetUserPwd" style="margin-left: auto;">リセットパスワード</el-button>
          </el-form-item>
        </div>
      </div>
    </el-card>

    <!-- CT/CTマスタ -->
    <consul-info-card
      v-if="['1', '2'].includes(base.userType)"
      v-model="consul"
      :userType="base.userType"
      :is-read-only="isReadOnly"
      ref="consulCardRef"
    />

    <!-- ワーカー/スーパーワーカー -->
    <worker-info-card 
      v-if="['3', '4'].includes(base.userType)" 
      v-model="worker" 
      :userType="base.userType"
      :is-read-only="isReadOnly"
      ref="workerCardRef"
    />

    <!-- Customer Card - Using the component -->
    <customer-info-card
      v-if="base.userType === '5'"
      v-model="detail"
      :userType="base.userType"
      :is-read-only="isReadOnly"
      ref="customerCardRef"
    />

    <div class="detail-btn-group-cls">
        <el-button type="primary" @click="save" v-show="!isReadOnly" :loading="loadingSave">保存する</el-button>
        <el-button @click="emit('close')">閉じる</el-button>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, reactive, ref, watch } from 'vue';
import { useFetch } from '#app'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ComponentSize, FormProps } from 'element-plus'
import SelectKeyFormatter from "@/components/ElxColumnSelectKey.vue";
import WorkerInfoCard from "@/components/user/WorkerInfoCard.vue";
import ConsulInfoCard from "@/components/user/ConsulInfoCard.vue";
import CustomerInfoCard from "@/components/user/CustomerInfoCard.vue";
import { sysUserRules } from '@/utils/validationRules'; // Import the validation rules

const labelPosition = ref<FormProps['labelPosition']>('top');

const emit = defineEmits(['save', 'close']);
const { $api } = useNuxtApp()
const loadingSave = ref(false);
const formRef = ref();
const consulCardRef = ref(); // consulCardRef を定義
const workerCardRef = ref(); // workerCardRef を定義
const customerCardRef = ref(); // customerCardRef を定義
const isLoading = ref(true);
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
  getUrl: String,
  editUrl: String,
  isReadOnly: Boolean,
  userId: {
    type: String,
    required: true,
  }
});

const clearContent = () => {
  base.value = {};
  consul.value = {};
  worker.value = {};
  detail.value = {};
};

// ユーザー拡張情報を取得する
const fetchUserData = async (userId) => {
  if (!userId) return;
  
  isLoading.value = true;
  try {
    const response = await useNuxtApp().$api(`${props.getUrl}/${userId}`, {
      method: 'GET',
    });
    if (response && response.code === 200 && response.data) {
      base.value = response.data.base || {};
      consul.value = response.data.consul || {};
      worker.value = response.data.worker || {};
      detail.value = response.data.detail || {};
    } else if (response && response.fail){
      ElMessage({type: 'error', message: response.msg, style: 'z-index: 3000;'});
      return;
    }
  } catch (error) {
    ElMessage({type: 'error', message: `Failed to fetch user data: ${error}`, style: 'z-index: 3000;'});
  } finally {
    isLoading.value = false;
  }
};

// ユーザーIDの変化を監視する
watch(() => props.userId, (newUserId, oldUserId) => {
  if (newUserId && newUserId !== oldUserId) {
    clearContent();
    fetchUserData(newUserId);
  }
}, { immediate: true });

const save = async () => {
  console.log("base---",base)
  console.log("consul---",consul)
  console.log("worker---",worker)
  console.log("detail---",detail)
  
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
    const response = await useNuxtApp().$api(props.editUrl, {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
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
    clearContent();
    emit('save', response);
  } catch (error) {
    ElMessage({type: 'error', message: `Failed to fetch user data: ${error}`, style: 'z-index: 3000;'});
  } finally {
    loadingSave.value = false;
  }

};

const resetUserPwd = async () => {
  if (!props.userId) {
    ElMessage({type: 'warning', message: 'ユーザーIDがありません', style: 'z-index: 3000;'});
    return;
  }

  // 先關閉 dialog
  emit('close');

  // 等 DOM 收斂（關閉動畫完成）
  await nextTick();

  try {
    await ElMessageBox.confirm(
      `本当にこのユーザー(${base.value.fullName})のパスワードをリセットしますか？`,
      '確認',
      {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      }
    );

    await $api(`/auth/pwd/reset?userId=${props.userId}`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" }
    });

    ElMessage({type: 'success', message: 'パスワードがリセットされました', style: 'z-index: 3000;'});
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage({type: 'error', message: 'パスワードのリセットに失敗しました: ' + error, style: 'z-index: 3000;'});
    }
  }
};

</script>