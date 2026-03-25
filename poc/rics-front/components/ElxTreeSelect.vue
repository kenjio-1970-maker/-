<template>
    <el-tree-select
      v-model="modelValue"
      :data="treeData"
      :render-after-expand="false"
      :show-checkbox="showCheckbox"
      :loading="loading"
      style="width: 100%"
    />
  </template>
  
  <script setup>
  import { ref, watchEffect } from "vue";
import { useNuxtApp } from '#app';
const { $api } = useNuxtApp();
// import dictStore from "@/stores/dictStore";
  
  const modelValue = defineModel({
    type: [String, Array],
    required: false,
    default: undefined
  });
  const props = defineProps({
    selectKey: String, // 字典 key
    showCheckbox: Boolean, // 是否显示复选框
  });
  const treeData = ref([]); // 存储树形数据
const loading = ref(false); // 加载状态
  
  // 监听 selectKey 变化，动态获取数据
  watchEffect(async () => {
    if (!props.selectKey) return;
    loading.value = true;
    try {
      const response = await $api(`/sys/tree/${props.selectKey}`);
      if (response && response.data) {
        treeData.value = response.data;
      } else {
        treeData.value = [];
        console.warn("ツリー型データの返却が空です。");
      }
    } catch (error) {
      console.error("ツリー型辞書の取得に失敗しました：", error);
      treeData.value = [];
    } finally {
      loading.value = false;
    }
  });
  </script>
  