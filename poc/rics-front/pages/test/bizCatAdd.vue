<template>
  <el-form label-width="80px" :rules="rules" :model="addRow" ref="addRowRef"
  >
    <el-form-item label="Name" prop="name">
      <el-input v-model="addRow.name" placeholder="please entry name" maxlength="5"></el-input>
    </el-form-item>
    <el-form-item label="Color" prop="color">
      <el-input v-model="addRow.color" placeholder="please select color"></el-input>
    </el-form-item>
    <el-form-item label="Birthday" prop="birthday">
      <el-input v-model="addRow.birthday" placeholder="please select birthday"></el-input>
    </el-form-item>
    <el-form-item label="Desc" prop="catDesc">
      <el-input v-model="addRow.catDesc" placeholder="please entry desc"></el-input>
    </el-form-item>
    <el-button type="primary" @click="save" :loading="loadingSave">保存</el-button>
  </el-form>
</template>

<script setup>
import {defineProps, defineEmits, reactive, ref} from 'vue';
// import axios from 'axios' // 引入 axios
import {useFetch} from '#app'
import {ElMessage, ElMessageBox} from 'element-plus'
import {onMounted} from "vue";
import '~/assets/css/app.css';

/*init fields*/
const loadingSave = ref(false);
const addRowRef = ref();
const {$api} = useNuxtApp()

const addRow = reactive({
  name: "",
  color: "",
  birthday: "",
  catDesc: "",
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
      ElMessage.error("データの読み込みに失敗しました。")
      loadingSave.value = false;
      return false;
    }
  });

  try {
    const response = await useNuxtApp().$api(props.addUrl, {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: {
        bizCat: addRow,
      }
    })
  } catch (error) {
    ElMessage({type: 'error', message: 'query error: ' + error, style: 'z-index: 3000;'});
  } finally {
    loadingSave.value = false;
  }
};

const rules = {
  name: [
    {required: true, message: 'please entry name', trigger: 'blur'},
    {max: 5, message: 'name max size 50', trigger: 'blur'},
  ],
  color: [
    {required: true, message: 'please select color', trigger: 'blur'},
  ],
  birthday: [
    {required: true, message: 'please select birthday', trigger: 'blur'},
  ],
  catDesc: [
    {required: true, message: 'please entry desc', trigger: 'blur'},
    {max: 100, message: '100文字を超えることはできません。', trigger: 'blur'},
  ],
};
</script>