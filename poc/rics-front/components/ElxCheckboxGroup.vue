<template>
  <!-- <el-checkbox-group v-model="innerValue" class="checkbox-container"> -->
    <el-checkbox-group v-model="innerValue" class="elx-single-or-choice-group-cls">
    <el-checkbox
        v-for="option in options"
        :key="option.code"
        :value="option.code"
        :label="option.mapping"
        :name="groupName"
        :style="{ display: styleLine, marginTop: styleLine ? '5px' : '0px' , marginBottom: styleLine ? '-10px' : '0px' }"
        class="elx-single-or-choice-ele"
        
    >
      {{ option.mapping }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script setup>
import { ref, watch, defineProps, defineModel, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import dictStore from "@/stores/dictStore";

styleLine: 'inline-block'  // 设置默认值

// 接收 props
const props = defineProps({
  selectKey: String,
  //   disabled: Boolean,
  groupName: String,
  styleLine: String,
});

// 接收 v-model 字符串 "a,b,c"
const modelValue = defineModel(); // string 类型

// 内部用于 checkbox-group 的数组类型值
const innerValue = ref([]);

// 将字符串 → 数组（适配 checkbox）
watch(
    () => modelValue.value,
    (newVal) => {
      innerValue.value = newVal ? newVal.split(',') : [];
    },
    { immediate: true }
);

// 将数组 → 字符串（回传给父组件）
watch(innerValue, (newArr) => {
  modelValue.value = newArr.join(',');
});

// 字典选项加载逻辑
const options = ref([]);
const { $api } = useNuxtApp();

const loadOptions = async () => {
  options.value = dictStore.getDict(props.selectKey);
  if (options.value.length === 0) {
    await fetchOptions();
  }
};

const fetchOptions = async () => {
  try {
    const response = await $api(`/sys/code/mapping/${props.selectKey}`);
    const data = await response.data;
    options.value = data;
    dictStore.setDict(props.selectKey, data);
  } catch (error) {
    console.error("辞書データの取得に失敗しました：", error);
  }
};

onMounted(() => {
  loadOptions();
});
</script>

<style scoped>
/* .checkbox-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
} */
</style>