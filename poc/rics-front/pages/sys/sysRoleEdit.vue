<template>
  <el-form label-width="80px" :model="detailRow" :rules="rules" ref="updRowRef">
    <el-form-item label="役割番号" prop="id"><el-input v-model="detailRow.id" placeholder="役割番号を入力してください" maxlength="32"></el-input></el-form-item>
<el-form-item label="役割名称" prop="roleName"><el-input v-model="detailRow.roleName" placeholder="役割名称を入力してください" maxlength="100"></el-input></el-form-item>
<el-form-item label="役割コード" prop="roleCode"><el-input v-model="detailRow.roleCode" placeholder="役割コードを入力してください" maxlength="32"></el-input></el-form-item>
<el-form-item label="役割タイプ" prop="roleType"><el-input v-model="detailRow.roleType" placeholder="役割タイプを入力してください" maxlength="32"></el-input></el-form-item>
<el-form-item label="作成者" prop="createUser"><el-input v-model="detailRow.createUser" placeholder="作成者を入力してください" maxlength="32"></el-input></el-form-item>
<el-form-item label="アップデート者" prop="updateUser"><el-input v-model="detailRow.updateUser" placeholder="アップデート者を入力してください" maxlength="32"></el-input></el-form-item>
<el-form-item label="作成時間" prop="createAt"><el-input v-model="detailRow.createAt" placeholder="作成時間を入力してください" ></el-input></el-form-item>
<el-form-item label="アップデート時間" prop="updateAt"><el-input v-model="detailRow.updateAt" placeholder="アップデート時間を入力してください" ></el-input></el-form-item>
    <el-button type="primary" @click="save" v-show="!isReadOnly" :loading="loadingSave">保存</el-button>
  </el-form>
</template>

<script setup>
import { defineProps, defineEmits, reactive, ref } from 'vue';
// import axios from 'axios' // 引入 axios
import { useFetch } from '#app'
import { ElMessage, ElMessageBox } from 'element-plus'

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

const save = async () => {
  updRowRef.value.validate((valid) => {
    if (!valid) {
      return false;
    }
  });

  try {
    loadingSave.value = true;
    const response = await useNuxtApp().$api(props.editUrl, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: {
        sysRole: props.detailRow,
      }
    })
    // emit('search', response)
  } catch (error) {
    ElMessage({type: 'error', message: 'Failed to retrieve data: '+error, style: 'z-index: 3000;'});
  }finally {
    loadingSave.value = false;
  }
};

const rules = {
  id: [{required: true, message: '役割番号を入力してください ', trigger: 'blur'},],
roleName: [{required: true, message: '役割名称を入力してください ', trigger: 'blur'},],
roleCode: [{required: true, message: '役割コードを入力してください ', trigger: 'blur'},],
roleType: [{required: true, message: '役割タイプを入力してください ', trigger: 'blur'},],
createUser: [{required: true, message: '作成者を入力してください ', trigger: 'blur'},],
updateUser: [{required: true, message: 'アップデート者を入力してください ', trigger: 'blur'},],
createAt: [{required: true, message: '作成時間を入力してください ', trigger: 'blur'},],
updateAt: [{required: true, message: 'アップデート時間を入力してください ', trigger: 'blur'},],
};
</script>