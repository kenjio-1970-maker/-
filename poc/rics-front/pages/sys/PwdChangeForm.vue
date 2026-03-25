<template>
  <el-form label-width="120px" :rules="rules" :model="form" :label-position="labelPosition" ref="formRef">
    <el-card class="el-crd-cls">

      <div class="dynamic-container">
        <el-form-item label="現在のパスワード" prop="oldPwd">
          <el-input v-model="form.oldPwd" type="password" autocomplete="off" class="width-zoom-2" />
        </el-form-item>
      </div>

      <div class="dynamic-container">
        <el-form-item label="新しいパスワード" prop="newPwd">
          <el-input v-model="form.newPwd" type="password" autocomplete="off" class="width-zoom-2"
            @input="checkStrength" />
        </el-form-item>
      </div>

      <div class="password-strength-container" v-if="usePasswordStrengthCheck && form.newPwd">
        <div class="strength-bar-wrapper">
          <div class="strength-bar-fill" :class="passwordStrengthClass" :style="{ width: passwordStrengthWidth }"></div>
        </div>
        <p class="strength-label">{{ passwordStrengthText }}</p>
      </div>

      <div class="dynamic-container">
        <el-form-item label="新しいパスワード（確認）" prop="confirmPwd">
          <el-input v-model="form.confirmPwd" type="password" autocomplete="off" class="width-zoom-2" />
        </el-form-item>
      </div>

      <div class="detail-btn-group-cls">
        <el-button type="primary" @click="submit" :loading="loading">変更</el-button>
        <el-button @click="$emit('close')">閉じる</el-button>
      </div>
    </el-card>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['close', 'logout'])

const usePasswordStrengthCheck = false // ← 這是開關，PM決定要不要的話可以設為 false

const form = ref({
  oldPwd: '',
  newPwd: '',
  confirmPwd: ''
})
const labelPosition = ref('top')
const formRef = ref()
const loading = ref(false)
const passwordStrength = ref('')
const passwordStrengthWidth = computed(() => {
  return ['33%', '66%', '100%'][passwordStrengthScore.value]
})

const rules = {
  oldPwd: [{ required: true, message: '現在のパスワードを入力してください', trigger: 'blur' }],
  newPwd: [{ required: true, message: '新しいパスワードを入力してください', trigger: 'blur' }],
  confirmPwd: [
    { required: true, message: '確認用のパスワードを入力してください', trigger: 'blur' },
    {
      validator: (_: unknown, value: string, callback: (error?: Error) => void) => {
        if (value !== form.value.newPwd) {
          callback(new Error('パスワードが一致しません'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const resetForm = () => {
  form.value.oldPwd = ''
  form.value.newPwd = ''
  form.value.confirmPwd = ''
  passwordStrength.value = ''
  formRef.value?.clearValidate?.()
}
const passwordStrengthScore = ref(0)

const passwordStrengthText = computed(() => {
  return ['弱い', '普通', '強い'][passwordStrengthScore.value]
})

const passwordStrengthClass = computed(() => {
  return ['weak', 'medium', 'strong'][passwordStrengthScore.value]
})

// 密碼強度評估函式
const getPasswordStrengthScore = (pwd: string): number => {
  let score = 0
  if (pwd.length >= 8) score++
  if (/[a-z]/.test(pwd)) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++

  if (score <= 2) return 0 // 弱い
  if (score <= 4) return 1 // 普通
  return 2 // 強い
}

const checkStrength = () => {
  if (!usePasswordStrengthCheck) return
  passwordStrengthScore.value = getPasswordStrengthScore(form.value.newPwd)
}

const submit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  if (usePasswordStrengthCheck) {
    const score = getPasswordStrengthScore(form.value.newPwd)
    if (score < 1) {
      ElMessage({type: 'error', message: 'パスワードが簡単すぎます（強度が低い）', style: 'z-index: 3000;'})
      return
    }
  }

  loading.value = true
  try {
    const response = await useNuxtApp().$api('/auth/pwd/modify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        oldPassword: form.value.oldPwd,
        newPassword: form.value.newPwd,
      }
    }) as { success?: boolean; msg?: string } | string;

    if (typeof response === 'string') {
      if (response === 'Password modified successfully') {
        ElMessage({type: 'success', message: 'パスワードが変更されました', style: 'z-index: 3000;'})
        setTimeout(() => emit('logout'), 1500)
      } else {
        ElMessage({type: 'error', message: response, style: 'z-index: 3000;'})
      }
    } else if (typeof response === 'object' && response !== null) {
      if (response.success) {
        ElMessage({type: 'success', message: 'パスワードが変更されました', style: 'z-index: 3000;'})
        setTimeout(() => emit('logout'), 1500)
      } else {
        ElMessage({type: 'error', message: response.msg || '変更に失敗しました', style: 'z-index: 3000;'})
        resetForm()
      }
    }

  } catch (err) {
    ElMessage({type: 'error', message: 'エラーが発生しました: ' + err, style: 'z-index: 3000;'})
  } finally {
    loading.value = false
  }
}

defineExpose({ resetForm })
</script>

<style scoped>
.password-strength-container {
  margin-top: -10px;
  margin-bottom: 15px;
}

.strength-bar-wrapper {
  height: 6px;
  width: 100%;
  background-color: #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
}

.strength-bar-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
  border-radius: 4px;
}

.strength-label {
  font-size: 12px;
  margin-top: 5px;
  color: #606266;
}

/* Color mappings */
.strength-bar-fill.weak {
  background-color: #f56c6c;
  /* red */
}

.strength-bar-fill.medium {
  background-color: #e6a23c;
  /* orange */
}

.strength-bar-fill.strong {
  background-color: #67c23a;
  /* green */
}
</style>
