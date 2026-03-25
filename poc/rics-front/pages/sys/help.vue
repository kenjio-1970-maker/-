<template>
  <div class="help-container">
    <h1 class="welcome-title">実家じまいへ、ようこそ！</h1>
    <el-divider></el-divider>
    </div>
</template>

<script lang="ts" setup>
import { ElDivider } from 'element-plus';
</script>

<style scoped>
.help-container {
  padding: 20px;
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

.welcome-title {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  color: #0078D7;
  margin-bottom: 10px;
}

.help-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.help-section {
  margin-bottom: 20px;
}

.help-section h2 {
  font-size: 18px;
  color: #0078D7;
  margin-bottom: 10px;
}

.help-section p, .help-section ul {
  margin-left: 10px;
}

.help-section ul {
  list-style-type: disc;
}

.help-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}
</style>
