<template>
  <el-form label-width="80px" :model="detailRow" :rules="rules" ref="updRowRef">
    <el-form-item label="Name">
      <el-input v-model="detailRow.name" placeholder="please entry name" :readonly="isReadOnly"></el-input>
    </el-form-item>
    <el-form-item label="Color">
      <el-input v-model="detailRow.color" placeholder="please select color" :readonly="isReadOnly"></el-input>
    </el-form-item>
    <el-form-item label="Birthday">
      <el-input v-model="detailRow.birthday" placeholder="please select birthday" :readonly="isReadOnly"></el-input>
      <div class="block">
    <span class="demonstration">Birthday</span>
    <el-date-picker
      v-model="detailRow.birthday"
      type="datetime"
      placeholder="选择日期时间">
    </el-date-picker>
  </div>
    </el-form-item>
    <el-form-item label="Desc">
      <el-input v-model="detailRow.catDesc" placeholder="please entry desc" :readonly="isReadOnly"></el-input>
    </el-form-item>
    <el-button type="primary" @click="save" v-show="!isReadOnly" :loading="loadingSave">保存</el-button>
  </el-form>
</template>

<script setup>
import { defineProps, defineEmits, reactive, ref } from 'vue';
// import axios from 'axios' // 引入 axios
import { useFetch } from '#app'
import { ElMessage, ElMessageBox } from 'element-plus'
import 'assets/css/app.css';

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
    const response = await $api(props.editUrl, {
      method: 'PUT',
      headers: { "Content-Type": "application/json"
       },
      
      body: JSON.stringify(props.detailRow)
    })

    // ✅ 这里不需要再手动调用 response.json()
    console.log("Response data:", response);

    // emit('search', response)
  } catch (error) {
    ElMessage({type: 'error', message: 'Failed to retrieve data: ' + error, style: 'z-index: 3000;'});
    /* debugger
    console.log(error);
    console.log(error.errorData);
    console.log(error.errorData.data);
    if (error.response?.status === 400) {
      ElMessage.error(error.response.message);
      ElMessage.error(error.response.data.message);
      ElMessage.error(error.response);
      console.log(error.response.message);
      console.log(error.response.data.message);
      console.log(error.errorData);
    }  */
  }finally {
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