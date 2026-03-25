<template>
  <el-form label-width="80px" :rules="rules" :model="addRow" ref="addRowRef"
  >
    <el-form-item label="名字" prop="customerName">
      <el-input v-model="addRow.customerName" placeholder="请输入名字" maxlength="5"></el-input>
    </el-form-item>
    <el-form-item label="电话" prop="phoneNumber">
      <el-input v-model="addRow.phoneNumber" placeholder="请输入电话" ></el-input>
    </el-form-item>
    <el-form-item label="地址" prop="address">
      <el-input v-model="addRow.address" placeholder="请输入地址" ></el-input>
    </el-form-item>
    <el-button type="primary" @click="save" :loading="loadingSave">保存</el-button>
  </el-form>
</template>

<script setup>
import {defineProps, defineEmits, reactive, ref} from 'vue';
// import axios from 'axios' // 引入 axios
import { useFetch } from '#app'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted } from "vue";

const loadingSave = ref(false);

// const isReadOnly = ref(true);
// const addRow = reactive({
//   customerName: "",
//   phoneNumber: "",
//   address: "",
// });

const rules = {
  customerName: [
    { required: true, message: '名前を入力してください。', trigger: 'blur' },
    { max: 5, message: '名前は50文字を超えてはいけません。', trigger: 'blur' },
  ],
  phoneNumber: [
    { required: true, message: '電話番号を入力してください。', trigger: 'blur' },
    { max: 15, message: '電話番号は15文字を超えてはいけません。', trigger: 'blur' },
  ],
  address: [
    { required: true, message: '住所を入力してください。', trigger: 'blur' },
    { max: 100, message: '住所は100文字を超えてはいけません。', trigger: 'blur' },
  ],
};
const addRowRef = ref();
const addRow = reactive({
    customerName: "",
  phoneNumber: "",
  address: "",
});

onMounted(() => {
  // addRow.value.customerName=props.detailRow.id;
debugger
  console.log("UUUUUUUUUUUUUU"+props.addUrl);
  console.log("UUUUUUUUUUUUUU"+props.addUrl);
});
// 接收父组件传递的数据
const props = defineProps({
  addUrl: String,
  // isReadOnly: Boolean,
  /*detailRow: {
    type: Object,
    required: true,
  }*/

});

// 定义事件，用于触发保存和关闭对话框
const emit = defineEmits(['save', 'close']);

// 保存操作
const { $api } = useNuxtApp()
const save = async () => {
  // emit('save', { ...props.detailRow }); // 将修改的数据传递给父组件  /cusBase/update
// debugger
  loadingSave.value=true;
  console.log("UUUUUUUUUUUUUU"+props.addUrl);
  console.log("UUUUUUUUUUUUUU"+props.addUrl);
  console.log("UUUUUUUUUUUUUU"+props.addUrl);
  console.log("UUUUUUUUUUUUUU"+props.addUrl);
  console.log(props.editUrl);

  addRowRef.value.validate((valid) => {
    if (valid) {
      // alert('可以提交');
      return false;
    } else {
      // alert('表单验证失败');
      return false;
    }
  });
  loadingSave.value=false;


  try {
    const response = await useNuxtApp().$api(props.addUrl, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: {
     /*   // ...searchForm,
        page: 1,
        pageSize: 10,*/
        cusBase: addRow,
      }
    })
    // emit('search', response)

  } catch (error) {
    ElMessage({type: 'error', message: 'データの読み込みに失敗しました。', style: 'z-index: 3000;'});
  }
};
</script>