<template>
  <div>
    <el-page-header @back="goBack">
      <template #content>
        <span class="text-large font-600 mr-3">编辑客户信息</span>
      </template>
    </el-page-header>
    <el-card class="form-card">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="form-container"
      >
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户名称"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const goBack = () => {
  router.back()
}

const formRef = ref()
const form = reactive({
  id: '',
  customerName: '',
  phone: '',
  address: '',
  email: ''
})

// 表单验证规则
const rules = {
  customerName: [{ required: true, message: '顧客名を入力してください。', trigger: 'blur' }],
  phone: [{ required: true, message: '電話番号を入力してください。', trigger: 'blur' }],
  address: [{ required: true, message: '住所を入力してください。', trigger: 'blur' }],
  email: [
    { required: true, message: 'メールアドレスを入力してください。', trigger: 'blur' },
    { type: 'email', message: '正しいメールアドレスの形式を入力してください。', trigger: 'blur' }
  ]
}

// 获取客户详情
const getCustomerDetail = async () => {
  try {
    const response = await useNuxtApp().$api(`/cusBase/${route.params.id}`, {
      method: 'GET'
    })
    const data = response.data
    Object.assign(form, data)
  } catch (error) {
    ElMessage({type: 'error', message: '顧客情報の取得に失敗しました。', style: 'z-index: 3000;'});
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await useNuxtApp().$api(`/cusBase/${form.id}`, {
          method: 'PUT',
          body: form
        })
        ElMessage({type: 'success', message: '編集が完了しました。', style: 'z-index: 3000;'});
        router.back()
      } catch (error) {
        ElMessage({type: 'error', message: '編集に失敗しました。', style: 'z-index: 3000;'});
      }
    }
  })
}

onMounted(() => {
  getCustomerDetail()
})
</script>

<style scoped>
.form-card {
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.el-button {
  margin-right: 10px;
}
</style>