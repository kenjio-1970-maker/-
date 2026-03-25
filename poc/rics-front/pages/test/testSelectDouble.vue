<template>
  <div>
    <el-select v-model="value" placeholder="Select" style="width: 240px">
      <el-option
        v-for="item in cities"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
        <span style="float: left">{{ item.label }}</span>
        <span
          style="
            float: right;
            color: var(--el-text-color-secondary);
            font-size: 13px;
          "
        >
          {{ item.value }}
        </span>
      </el-option>
    </el-select>
    <el-input v-model="inputVal" style="width: 240px" placeholder="Please input" />
    <el-button type="primary" style="margin-left: 10px" @click="openSelectDialog">获取输入值</el-button>

    <p/>
    <elx-select v-model="handlingStatus" selectKey="SCM_POTENTIAL_RESP_STATUS" style="width: 240px"></elx-select>
    <el-button type="primary" style="margin-left: 10px" @click="handleSubmit">提交</el-button>
    
    <!-- 跳转用户选择 -->
    <el-dialog v-model="selectDialogVisible" title="ユーザーを選択してください" width="70%" heigth="70%">
      <sysUserList  @select-user="handleSelectUser" :isshowBtn="false"  ref="sysUserListRef"/>
    </el-dialog>
    
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
// import ElxSelect from "#build/components/ElxSelect.vue";
import sysUserList from "@/pages/sys/sysUserList.vue";

const value = ref('')
const handlingStatus = ref('')
const inputVal = ref('')


const handleSubmit = () => {
  console.log('Selected value:', value.value)
}

// 跳转用户选择
const selectDialogVisible = ref(false)
const openSelectDialog = () => {
  console.log('Input value:', inputVal.value)
  selectDialogVisible.value = true;
}
const handleSelectUser = (userData: any) => {
  inputVal.value = userData.email
  selectDialogVisible.value = false
}


const cities = [
  {
    value: 'Beijing',
    label: '北京',
  },
  {
    value: 'Shanghai',
    label: '上海市',
  },
  {
    value: 'Nanjing',
    label: 'Nanjing',
  },
]
</script>
