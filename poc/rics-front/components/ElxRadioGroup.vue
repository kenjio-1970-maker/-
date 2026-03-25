<template>
    <!-- <el-checkbox-group v-model="modelValue">
      <el-checkbox
        v-for="option in options"
        :key="option.code"
        :value="option.code"
        :label="option.mapping"
        :name="groupName"
      >
        {{ option.mapping }}
      </el-checkbox>
    </el-checkbox-group> -->

    <el-radio-group v-model="modelValue" class="elx-single-or-choice-group-cls" :style="{ display: styleLine }" >
      <el-radio
        v-for="option in options"
        :key="option.code"
        :label="option.mapping"
        :name="groupName"
        :value="option.code"
        :style="{ display: styleLine }"
        class="elx-single-or-choice-ele"
      >
      {{ option.mapping }}
    </el-radio>
  </el-radio-group>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, defineModel } from 'vue'
import { useNuxtApp } from '#app'
import dictStore from "@/stores/dictStore";

const props = defineProps({
  selectKey: String,         // 通过 selectKey 获取字典数据
  groupName: String,
  styleLine: {
    type: String,
    default: 'inline-block',
  },
});

const modelValue = defineModel({
  required: true
});
const options = ref([]);
const { $api } = useNuxtApp();

const loadOptions = async () => {
  // 1. 先从缓存中取
  options.value = dictStore.getDict(props.selectKey);
  if (options.value.length === 0) {
    console.log(`辞書 ${props.selectKey} のキャッシュが空です。バックエンドから取得を試みています。`);
    await fetchOptions();
  }
};

const fetchOptions = async () => {
  try {
    debugger
    const response = await $api(`/sys/code/mapping/${props.selectKey}`);
    if (response && response.data) {
      options.value = response.data;
    } else {
      console.error("APIの返却データ形式が正しくありません。");
      options.value = [];
    }
    dictStore.setDict(props.selectKey, response.data);  // 存入缓存
  } catch (error) {
    console.error("辞書データの取得に失敗しました。:", error);
  }
};

onMounted(() => {
  loadOptions();
});
</script>
  