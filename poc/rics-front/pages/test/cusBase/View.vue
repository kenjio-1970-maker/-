<template>
  <div>
    <el-page-header @back="goBack">
      <template #content>
        <span class="text-large font-600 mr-3">查看客户信息</span>
      </template>
    </el-page-header>
    <el-card class="form-card">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="客户名称">
          {{ form.customerName }}
        </el-descriptions-item>
        <el-descriptions-item label="联系电话">
          {{ form.phone }}
        </el-descriptions-item>
        <el-descriptions-item label="地址">
          {{ form.address }}
        </el-descriptions-item>
        <el-descriptions-item label="邮箱">
          {{ form.email }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ form.createTime }}
        </el-descriptions-item>
      </el-descriptions>
      <div class="form-actions">
        <el-button @click="goBack">返回</el-button>
      </div>
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

const form = reactive({
  customerName: '',
  phone: '',
  address: '',
  email: '',
  createTime: ''
})

// 获取客户详情
const getCustomerDetail = async () => {
  try {
    const response = await useNuxtApp().$api(`/cusBase/${route.params.id}`, {
      method: 'GET'
    })
    const data = response.data
    Object.assign(form, data)
  } catch (error) {
    ElMessage({type: 'error', message: 'データの取得に失敗しました', style: 'z-index: 3000;'});
  }
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

.form-actions {
  margin-top: 20px;
  text-align: center;
}

.el-descriptions {
  margin: 20px;
}
</style>