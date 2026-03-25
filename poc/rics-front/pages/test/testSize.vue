<template>
  <div>
    
    <el-radio-group v-model="labelPosition" aria-label="position control">
      <el-radio-button value="left">Left</el-radio-button>
      <el-radio-button value="right">Right</el-radio-button>
      <el-radio-button value="top">Top</el-radio-button>
    </el-radio-group>
  </div>
  <br />
  <el-form
    :label-position="labelPosition"
  >
    <el-form-item label="Activity name">
      <el-input v-model="sizeForm.name" />
    </el-form-item>
    
  </el-form>
</template>

<script lang="ts" setup>
import type { ComponentSize, FormProps } from 'element-plus'

const labelPosition = ref<FormProps['labelPosition']>('right')

const sizeForm = reactive({
  name: '',
  region: '',
})

</script>

