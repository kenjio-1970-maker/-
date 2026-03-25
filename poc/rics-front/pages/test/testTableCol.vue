<template>
  <el-table :data="tableData" stripe style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180">
      <template #default="{ row }">
        <el-tag :type="getTagType(row.name)" effect="dark" style="margin-right: 5px">{{ row.name }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>

<script lang="ts" setup>
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Sony',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Apple',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Sanxing',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

// 根据 name 返回不同的标签类型
const getTagType = (name: string): string => {
  switch (name) {
    case 'Sony':
      return 'danger' // 红色
    case 'Apple':
      return 'success' // 绿色
    case 'Sanxing':
      return 'info' // 蓝色
    default:
      return 'warning' // 黄色
  }
}
</script>

<style scoped>
/* 可选：自定义样式 */
</style>
