<template>
  <el-form label-width="80px" :model="detailRow">
    <el-form-item label="名字">
      <el-input v-model="detailRow.customerName" placeholder="请输入名字" :readonly="isReadOnly"></el-input>
    </el-form-item>
    <el-form-item label="电话">
      <el-input v-model="detailRow.phoneNumber" placeholder="请输入电话" :readonly="isReadOnly"></el-input>
    </el-form-item>
    <el-form-item label="地址">
      <el-input v-model="detailRow.address" placeholder="请输入地址" :readonly="isReadOnly"></el-input>
    </el-form-item>
    <el-button type="primary" @click="save" v-show="!isReadOnly">保存</el-button>
  </el-form>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
// import axios from 'axios' // 引入 axios
import { useFetch } from '#app'
import { ElMessage, ElMessageBox } from 'element-plus'


// const isReadOnly = ref(true);



// 接收父组件传递的数据
const props = defineProps({
  editUrl: String,
  isReadOnly: Boolean,
  detailRow: {
    type: Object,
    required: true,
  }

});

// 定义事件，用于触发保存和关闭对话框
const emit = defineEmits(['save', 'close']);

// 保存操作
const { $api } = useNuxtApp()
const save = async () => {
  // emit('save', { ...props.detailRow }); // 将修改的数据传递给父组件  /cusBase/update
// debugger
  console.log("MMMMMMMMNNN"+props.detailRow.email);
  console.log(props.editUrl);
  try {
    const response = await useNuxtApp().$api(props.editUrl, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        // ...searchForm,
        page: 1,
        pageSize: 10,
        cusBase: props.detailRow,
      }
    })
    // emit('search', response)

  } catch (error) {
    ElMessage.error('データの取得に失敗しました'+error);
  }
};
</script>