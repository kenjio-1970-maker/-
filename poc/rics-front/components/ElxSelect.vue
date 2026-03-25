<template>
  <el-select v-model="innerValue" :disabled="disabled" :multiple="multiple" clearable :placeholder="placeholder">
    <el-option v-for="item in options" :key="item[keyName]" :label="item[labelName]" :value="item[keyName]">

<!--     带有标签的下拉框, 已测试通过  
  <el-option v-for="item in options" :key="item.companyName" :label="item.companyName" :value="item.code"> 
  <span style="float: left">{{ item.mapping }}</span>
      <span
          style="
            float: right;
            color: var(&#45;&#45;el-text-color-secondary);
            font-size: 13px;
          "
      >
          {{ item.code }}
        </span>-->
    </el-option>
  </el-select>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, defineModel, watch } from 'vue'
import { useNuxtApp } from '#app'
import dictStore from "@/stores/dictStore";

const props = defineProps({
  selectKey: String,
  disabled: Boolean,
  selectUrl: {
    type: String,
    default: '/sys/code/mapping'
  },
  keyName: {
    type: String,
    default: 'code'
  },
  labelName: {
    type: String,
    default: 'mapping'
  },
  multiple: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
});

const modelValue = defineModel();
const options = ref([]);
const { $api } = useNuxtApp();

// 内部用于 multiple 的值（数组或单值）
const innerValue = ref(props.multiple ? [] : null);

// 监听 modelValue，根据是否为多选进行适配
watch(
  () => modelValue.value,
  (newVal) => {
    if (props.multiple) {
      innerValue.value = newVal ? newVal.split(',') : [];
    } else {
      innerValue.value = newVal;
    }
  },
  { immediate: true }
);

// 将 innerValue 的变化回传给父组件
watch(innerValue, (newVal) => {
  if (props.multiple) {
    modelValue.value = Array.isArray(newVal) ? newVal.join(',') : newVal;
  } else {
    modelValue.value = newVal;
  }
});

const loadOptions = async () => {
  // 1. 先从缓存中取
  options.value = dictStore.getDict(props.selectKey);
  if (options.value.length === 0) {
    // console.log(`辞書 ${props.selectKey} のキャッシュが空です。バックエンドから取得を試みています。`);
    await fetchOptions();
  }
};

// Helper method to check if selectKey is valid
const isValidSelectKey = () => props.selectKey && props.selectKey.trim() !== '';

const fetchOptions = async () => {
  try {
    const response = await $api(
      isValidSelectKey() 
        ? `${props.selectUrl}/${props.selectKey}` 
        : `${props.selectUrl}`
    );
    const data = await response.data;
    options.value = data;
    if (isValidSelectKey()) {
      dictStore.setDict(props.selectKey, data);
    }
  } catch (error) {
    console.log('错误的键:', props.selectKey);
    console.error("辞書データの取得に失敗しました。:", error);
  }
};

onMounted(() => {
  loadOptions();
});
</script>
