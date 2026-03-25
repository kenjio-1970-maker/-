<template>
  <el-form label-width="80px" :rules="rules" :model="addRow" ref="addRowRef"
  >
  <el-form-item label="役割番号" prop="id"><el-input v-model="addRow.id" placeholder="役割番号を入力してください" maxlength="32"></el-input></el-form-item>
<el-form-item label="役割名称" prop="roleName"><el-input v-model="addRow.roleName" placeholder="役割名称を入力してください" maxlength="100"></el-input></el-form-item>
<el-form-item label="役割コード" prop="roleCode"><el-input v-model="addRow.roleCode" placeholder="役割コードを入力してください" maxlength="32"></el-input></el-form-item>
<el-form-item label="役割タイプ" prop="roleType"><el-input v-model="addRow.roleType" placeholder="役割タイプを入力してください" maxlength="32"></el-input></el-form-item>
<el-form-item label="作成者" prop="createUser"><el-input v-model="addRow.createUser" placeholder="作成者を入力してください" maxlength="32"></el-input></el-form-item>
<el-form-item label="アップデート者" prop="updateUser"><el-input v-model="addRow.updateUser" placeholder="アップデート者を入力してください" maxlength="32"></el-input></el-form-item>
<el-form-item label="作成時間" prop="createAt"><el-input v-model="addRow.createAt" placeholder="作成時間を入力してください" ></el-input></el-form-item>
<el-form-item label="アップデート時間" prop="updateAt"><el-input v-model="addRow.updateAt" placeholder="アップデート時間を入力してください" ></el-input></el-form-item>
    <el-button type="primary" @click="save" :loading="loadingSave">保存</el-button>
  </el-form>
</template>

<script setup>
import {defineProps, defineEmits, reactive, ref} from 'vue';
// import axios from 'axios' // 引入 axios
import {useFetch} from '#app'
import {ElMessage, ElMessageBox} from 'element-plus'
import {onMounted} from "vue";

/*init fields*/
const loadingSave = ref(false);
const addRowRef = ref();
const {$api} = useNuxtApp()

const addRow = reactive({
  id: "", 
roleName: "", 
roleCode: "", 
roleType: "", 
createUser: "", 
updateUser: "", 
createAt: "", 
updateAt: "", 
});

onMounted(() => {
});

const props = defineProps({
  addUrl: String,
});

const emit = defineEmits(['save', 'close']);

const save = async () => {
  loadingSave.value = true;
  addRowRef.value.validate((valid) => {
    if (!valid) {
      ElMessage.error("フォームの検証に失敗しました。")
      loadingSave.value = false;
      return false;
    }
  });

  try {
    const response = await useNuxtApp().$api(props.addUrl, {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: {
        sysRole: addRow,
      }
    })
  } catch (error) {
    ElMessage.error('query error: ' + error);
  } finally {
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