<template>
  <el-collapse class="search-card">
    <el-collapse-item name="1" >
    <template #title>
      <span class="collapse-title-bar"></span>
      <span class="search-title">検索条件</span>
    </template>
      <el-card >
        <el-form label-width="auto" class="search-form" >
          <el-form-item v-for="(field, index) in searchFields" :key="index" :label="(field.inTyp === 'select' && userKbn !== '') ? '' : field.label" :class="{ 'from-potential': fromPotential }">
            <!-- <el-input v-model="searchForm[field.prop]" :placeholder="`请输入${field.label}`" :style="{ width: '240px' }" /> -->
          <el-input v-if="(field.inTyp || 'text') === 'text'" v-model="searchForm[field.prop]" class="full-width-input"  style="width: 100%" v-bind="field.maxlength ? { maxlength: field.maxlength } : {}"/>
            <el-input v-if="field.inTyp === 'textarea'" v-model="searchForm[field.prop]" autosize type="textarea" class="full-width-input" v-bind="field.maxlength ? { maxlength: field.maxlength } : {}"/>
            <el-input v-if="field.inTyp === 'number'" v-model.number="searchForm[field.prop]" class="full-width-input" v-bind="field.maxlength ? { maxlength: field.maxlength } : {}"/>
            <!--<elx-select v-if="field.inTyp === 'select' && userKbn ===''" v-model="searchForm[field.prop]" :selectKey="typeof field.selectKey === 'function' ? field.selectKey(searchForm) : field.selectKey" :style="{ width: field.width || '100%' }" style="width: 200px"/>-->
            <elx-select v-if="field.inTyp === 'select' && userKbn ===''" v-model="searchForm[field.prop]" :selectKey="typeof field.selectKey === 'function' ? field.selectKey(searchForm) : field.selectKey" :selectUrl="field.selectUrl"  :keyName = "field.keyName" :labelName = "field.labelName" :style="{ width: field.width || '100%' }" style="width: 200px"/>
            <el-date-picker v-if="field.inTyp === 'date'" v-model="searchForm[field.prop]" type="date" aria-label="Pick a date" :style="{ width: field.width || '150px' }"/>
            <!-- <el-date-picker v-if="field.inTyp === 'datetime'" v-model="searchForm[field.prop]" type="datetime" aria-label="Pick a datetime" :style="{ width: field.width || '150px' }" default-time="00:00:00"></el-date-picker> -->
            <el-time-picker v-if="field.inTyp === 'time'" v-model="searchForm[field.prop]" aria-label="Pick a time" style="width: 100%"/>
            <el-date-picker v-if="field.inTyp === 'datetime'" v-model="searchForm[field.prop]" type="datetime"> </el-date-picker>
          </el-form-item>
        </el-form>
        <el-form class="search-action">
          <el-form-item class="search-action-form-item" :class="{ 'from-potential': fromPotential }">
            <el-button type="primary" :icon="Search" @click="handleSearch">検索</el-button>
            <el-button :icon="RefreshLeft" @click="handleReset">クリア</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-collapse-item>
  </el-collapse>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { RefreshLeft, Search } from "@element-plus/icons-vue";

const props = defineProps({
  searchFields: { type: Array, required: true },
  searchUrl: { type: String, required: true },
  fromPotential: { type: Boolean, required: false, default: false },
  userKbn: { type: String, required: false, default: '' },
})

const searchForm = reactive({})

const emit = defineEmits(['search'])

const handleSearch = async () => {
  console.log('Search triggered with:', searchForm); // 添加日志，确保只在点击按钮时触发
  emit('search', searchForm); // 通过点击按钮触发搜索
}

const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''; // 清空搜索表单
  });
  
  handleSearch(); // 重置后触发搜索
}

watch(() => props.userKbn, (newVal) => {
  if (props.fromPotential && String(newVal) === '1') {
    props.searchFields.forEach(field => {
      if (field.inTyp === 'select') {
        searchForm[field.prop] = '1';
      }
    });
    handleSearch();
  } else if (props.fromPotential && String(newVal) === '3') {
    props.searchFields.forEach(field => {
      if (field.inTyp === 'select') {
        searchForm[field.prop] = '3';
      }
    });
    handleSearch();
  }
}, { immediate: true });

onMounted(() => {
  handleSearch(); // 初始化时调用 handleSearch
});
</script>

<style>
.search-card {
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: auto;
  /* card内元素与card顶部样式 */
  /* padding: 20px 20px 0px; */
  /* padding: 50px 50px 50px 50px ; */
  margin: 0px 0px 0px 0px; /* 移除可能的外边距干扰 */
}

.search-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px; /* 根据需要调整间距 */
}

.vertical-color-block {
  width: 4px;
  height: 20px; /* 根据需要调整高度 */
  background-color: #409EFF; /* 默认主题色 */
  margin-right: 8px;
  border-radius: 2px; /* 可选：让颜色块有圆角 */
}

.search-form {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap; /* 支持自动换行 */
  align-items: center;
  padding: 0px 0px 0px 0px; /* 移除可能的内边距干扰 */
  margin: -15px 0px 0px -8px; /* 移除可能的外边距干扰 */
  justify-content: flex-start;
}

/* 搜索重置按钮组 */
.search-action {
  /* display: flex; */
  justify-content: center; /* 确保按钮容器居中 */
  align-items: center;
  margin-bottom: -10px;
 /* gap: 10px;  增加按钮之间的间距 */
  width: 100%; /* 确保容器宽度占满 */
}

.search-action-form-item {
  /* display: flex;  *//* 确保按钮在同一行 */
  justify-content: center; /* 按钮居中 */
  align-items: center;
  width: 100%; /* 确保容器宽度占满 */
  margin: 0; /* 移除可能的外边距干扰 */
}
.el-form-item__label {
  flex-shrink: 0; /* 防止标题被压缩 */
  margin-right: 0px; /* 设置标题与输入框的水平间距 */
  white-space: nowrap; /* 防止标题换行 */
}

.el-form-item {
  flex: unset !important; /* 再次覆盖 flex: 1; 的影响 */
}

.el-form-item__content {
  flex: unset !important; /* 覆盖浏览器样式，移除 flex: 1; 的影响 */
}

/* 按钮与上方模块间隔， 改动会覆盖全局 */
.el-button {
  margin-top: 1px;
}
.el-form-item__label-wrap{
  margin-left: 10px !important;
}
.search-form :deep(.el-form--inline .el-form-item) {
  display: initial !important;
  padding: 5px;
  border-radius: 4px;
  margin-left: 0px;
}

.from-potential {
  display: flex !important;
  padding: 10px 0px 0px 0px;
}

.search-title {
  font-weight: bold; /* 字体加粗 */
  color: rgb(66, 151, 215); /* 使用与用户名称相同的蓝色 */
  font-size: medium;
}

.collapse-title-bar {
  display: inline-block;
  width: 4px;
  height: 22px;
  background: #409EFF;
  border-radius: 2px;
  margin-right: 8px;
  margin-left: 8px;
  vertical-align: middle;
}

.el-collapse-item__content {
  padding-bottom: 0 !important;
}
</style>