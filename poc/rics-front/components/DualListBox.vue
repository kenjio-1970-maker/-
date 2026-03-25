<template>
    <div style="text-align: center">    
        <el-transfer
        v-model="selectedValues"
        :props="{
            key: 'value',
            label: 'desc',
        }"
        :data="data"
        />
        <el-button type="primary" @click="handleSubmit" style="margin-top: 20px">Submit</el-button>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  urlList: { type: String, required: true },
  urlSubmit: { type: String, required: true },
  bizNo: { type: String, required: true },
})

interface Option {
    value: string
    desc: string
    /* disabled: boolean */
  }
  
  /* const generateData = () => {
    // 移除静态数据生成
    return []
  } */
  
  const selectedValues = ref<string[]>([])
  const data = ref<Option[]>([])

  onMounted(async () => {
    try {
      
  console.log("ChildComponent がマウントされました");
    const response = await useNuxtApp().$api(`${props.urlList}/${props.bizNo}`);
        // const response = await useNuxtApp().$api(props.urlList, { 
        //   method: 'POST' ,
        //   params: {
        //     dualBizNo: props.bizNo,
        //   }
        // });
        data.value = response.data.data;
        console.log('Transferコンポーネントのデータソース：', data.value);
        
        if (response.data.selectedValues) {
          selectedValues.value = response.data.selectedValues.map(item => item.value);
          console.log('初期選択値：', selectedValues.value);
        }
    } catch (error) {
      console.error('インターフェースへのリクエスト中にエラーが発生しました：', error); // 添加日志输出
      ElMessage({type: 'error', message: 'データの読み込みに失敗しました。', style: 'z-index: 3000;'});
    }
  })
  const handleSubmit = () => {
    /* if (selectedValues.value.length === 0) {
      ElMessage.warning('请先选择要提交的内容')
      return
    } */
    
    // 获取右框数据（已选中项）
    const rightData = data.value.filter(item => selectedValues.value.includes(item.value))
    // 获取左框数据（未选中项）
    const leftData = data.value.filter(item => !selectedValues.value.includes(item.value))
    
    console.log('左側の枠のデータ（未選択項目）:', leftData)
    console.log('右側の枠のデータ（選択済み項目）:', rightData)
    
    // 这里需要补充实际的API调用逻辑
    ElMessage({type: 'success', message: `選択した${selectedValues.value.length}項目を送信しました。`, style: 'z-index: 3000;'});
  }
</script>
