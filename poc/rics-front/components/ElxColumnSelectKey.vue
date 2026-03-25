<template>
  <span>{{ formattedValue }}</span>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue'
import dictStore from "@/stores/dictStore";
import { useNuxtApp } from '#app';

const props = defineProps({
  selectKey: String,   // 字典的key
  value: [String, Number],  // 需要格式化的值，可以是单个值或逗号分隔的多个值
});

// 用来存储格式化后的值
const formattedValue = ref('');

// 用于从字典获取映射
const { $api } = useNuxtApp();

// 格式化单个值
const formatSingleValue = (value, selectKey) => {
  const options = dictStore.getDict(selectKey);
  if (options.length > 0) {
    const option = options.find(item => item.code === value);
    return option ? option.mapping : value; // 返回对应的中文映射
  }
  return value;
};

// 格式化多个值
const formatMultipleValues = (value, selectKey) => {
  const values = value.split(',');  // 将逗号分隔的字符串转为数组
  return values.map(val => formatSingleValue(val, selectKey)).join(', '); // 格式化并用逗号连接
};

// 格式化传入的值
const formatValue = (value, selectKey) => {
  if (typeof value === 'string' && value.includes(',')) {
    // 如果值包含逗号，说明是多个值
    return formatMultipleValues(value, selectKey);
  }
  // 否则处理单个值
  return formatSingleValue(value, selectKey);
}

// 在组件加载时调用
onMounted(() => {
  formattedValue.value = formatValue(props.value, props.selectKey);
});
</script>