<template>
  <span>{{ formattedValue }}</span>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue'
import dayjs from 'dayjs';

const props = defineProps({
  formatDate: String, 
  value: String,  // 需要格式化的值，可以是单个值或逗号分隔的多个值
});

// 用来存储格式化后的值
const formattedValue = ref('');

// 格式化传入的值
const formatValue = (value) => {
  return value ? dayjs(value).format(props.formatDate) : '-'; 
}

// 在组件加载时调用
onMounted(() => {
  formattedValue.value = formatValue(props.value);
});

/**
 * Day.js 日期格式说明参考表
 * https://day.js.org/docs/en/display/format
 *
 * 格式符    | 含义             | 示例输出       | 说明
 * --------- | ---------------- | -------------- | ------------------------
 * YYYY      | 年（四位）        | 2025           | e.g. 2025
 * YY        | 年（两位）        | 25             | e.g. 2025 -> 25
 * MM        | 月（两位）        | 04             | 一月到十二月：01-12
 * M         | 月（不补0）       | 4              | 一月到十二月：1-12
 * DD        | 日（两位）        | 09             | 一号到三十一号：01-31
 * D         | 日（不补0）       | 9              | 一号到三十一号：1-31
 * HH        | 小时（24小时制）  | 14             | 0-23，小于10补0
 * H         | 小时（24小时制）  | 4              | 0-23，不补0
 * hh        | 小时（12小时制）  | 02             | 01-12，小于10补0
 * h         | 小时（12小时制）  | 2              | 1-12，不补0
 * mm        | 分钟（两位）      | 07             | 0-59
 * m         | 分钟（不补0）     | 7              | 0-59
 * ss        | 秒（两位）        | 05             | 0-59
 * s         | 秒（不补0）       | 5              | 0-59
 * A         | 上午/下午（大写） | AM / PM        | 英文
 * a         | 上午/下午（小写） | am / pm        | 英文
 * d         | 星期几（数字）    | 0（周日）～6（周六）|
 * ddd       | 周缩写           | Sun            | 英文缩写
 * dddd      | 周全称           | Sunday         | 英文全称
 *
 * 📌 示例：
 * dayjs().format("YYYY-MM-DD HH:mm:ss") => "2025-04-11 14:26:30"
 */
</script>
