<template>
    <div>

    <div>
      <!-- Welcom -->
      <el-skeleton :rows="15" animated />
    </div>
      <el-page-header @back="goBack">
        <template #content>
          <span class="text-large font-600 mr-3">問い合わせ管理</span>
        </template>
        <template #extra>
          <div class="flex items-center">
            <el-button type="primary" class="ml-2 new-add-button">新規作成</el-button>
          </div>
        </template>
      </el-page-header>
      <el-card class="search-card">
        <template #header>
          <div class="card-header"> <span>検索条件</span> </div>
        </template>
        <el-form label-width="auto" class="search-form">
          <el-form-item label="ランク">
            <el-select v-model="selectedValue" placeholder="Select" style="width: 240px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="期間_開始日">
            <el-date-picker type="date" placeholder="Select date" style="width: 100%"></el-date-picker>
          </el-form-item>
          <el-form-item label="期間_終了日">
            <el-date-picker type="date" placeholder="Select date" style="width: 100%"></el-date-picker>
          </el-form-item>
          <el-form-item label="相談者名">
            <el-input placeholder="相談者名を入力してください" style="width: 100%"></el-input>
          </el-form-item>
        </el-form>
        <el-form class="search-action">
          <el-form-item>
            <el-button type="primary">検索</el-button>
            <el-button>リセット</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="search-result-card">
        <template #header>
          <div class="card-header"> <span>検索結果</span> </div>
        </template>
        <div>
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="customer" label="相談者" width="180" />
            <el-table-column prop="rank" label="ランク" width="180" />
            <el-table-column prop="status" label="状態" />
            <el-table-column prop="date" label="日付" />
            <el-table-column prop="constant" label="コンサル担当" />
            <el-table-column prop="note" label="備考" width="300" />
            <el-table-column prop="opt" label="操作" width="100">
              <template #default="scope">
                <el-button type="primary" @click.prevent="editRow(scope.$index)" style="margin-left: 0px;">
                  編集
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="search-result-paging">
            <el-pagination background layout="prev, pager, next" :total="1000" />
          </div>
        </div>
      </el-card>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { date } from 'yup';
  
  const goBack = () => {
    console.log('go back')
  }
  
  // const sampleHello = await useNuxtApp().$api('/sample/hello', {
  //   method: 'GET'
  // });
  
  const options = ref([
    { value: '1', label: 'S' },
    { value: '2', label: 'A' },
    { value: '3', label: 'B' },
    { value: '4', label: 'C' }
  ])
  
  const selectedValue = ref('')
  
  const editRow = (index: number) => {
    console.log('editRow', index)
  }
  
  const tableData = [
    {
      customer: '実家太郎',
      rank: 'S',
      status: '未対応',
      date: '2021-10-01',
      constant: '山田太郎',
      note: '特になし'
    },
    {
      customer: '実家太郎',
      rank: 'S',
      status: '未対応',
      date: '2021-10-01',
      constant: '山田太郎',
      note: '特になし'
    },
    {
      customer: '実家太郎',
      rank: 'S',
      status: '未対応',
      date: '2021-10-01',
      constant: '山田太郎',
      note: '特になし'
    },
    {
      customer: '実家太郎',
      rank: 'S',
      status: '未対応',
      date: '2021-10-01',
      constant: '山田太郎',
      note: '特になし'
    }
  ]
  </script>
  
  <style scoped>
  .search-card {
    margin: 20px;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    height: 22vh;
  }
  
  .search-result-card {
    margin: 20px;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    height: 51vh;
  }
  
  .card-header {
    font-size: 18px;
    text-align: left;
  }
  
  .search-form {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .search-action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  
  .search-result-paging {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 40px;
  }
  
  .el-button {
    margin-top: 5px;
    margin-left: 38px;
  }
  
  .new-add-button {
    margin-right: 20px;
  }
  </style>
  