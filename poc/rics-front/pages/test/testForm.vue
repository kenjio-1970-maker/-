<template>


  <!-- 文本框 -->
  <el-form :model="form" label-width="auto" style="max-width: 600px">
    <el-form-item label="用户名">
      <el-input v-model="form.name"/>
    </el-form-item>

    <!--  下拉框 -->
    <el-form-item label="颜色选择">
      <el-select v-model="form.color" placeholder="颜色...">
        <el-option label="红色" value="aka"/>
        <el-option label="蓝色" value="ao"/>
        <el-option label="白色" value="shiro"/>
      </el-select>
    </el-form-item>

    <!--    日期选择框-->
    <el-form-item label="日期选择">
      <el-col :span="11">
        <el-date-picker
          v-model="form.date1"
          placeholder="选择日期"
          style="width: 100%"
        ></el-date-picker>
      </el-col>
      <el-col :span="2" class="text-center">
        <span class="text-gray-500">-</span>
      </el-col>
      <el-col :span="11">
        <el-time-picker
          v-model="form.date2"
        >
        </el-time-picker>
      </el-col>
    </el-form-item>

    <!-- 铺开多选 -->
    <el-form-item label="颜色多选">
      <el-checkbox-group v-model="form.colorCheckbox">
        <el-checkbox value="aka" name="colorName">红色</el-checkbox>
        <el-checkbox value="ao" name="colorName">蓝色</el-checkbox>
        <el-checkbox value="shiro" name="colorName">白色</el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <!-- 铺开单选 -->
    <el-form-item label="日间时刻">
      <el-radio-group v-model="form.asa">
        <el-radio value="aka">红色</el-radio>
        <el-radio value="ao">蓝色</el-radio>
        <el-radio value="shiro">白色</el-radio>
      </el-radio-group>
    </el-form-item>

    <!--   大文本框 -->
    <el-form-item label="简介">
      <el-input v-model="form.desc" type="textarea"></el-input>
    </el-form-item>

  </el-form>

  <!-- 表单行内 -->
  <el-form :model="formLine" :inline="true" class="form-inline" label-width="auto" label-position="left">
    <el-form-item  label="名字" >
      <el-input v-model="formLine.name" placeholder="名字..." clearable></el-input>
    </el-form-item>
    <el-form-item label="颜色">
      <el-select v-model="formLine.color" clearable>
        <el-option label="红色" value="aka" />
        <el-option label="蓝色" value="ao" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
  </el-form>

  

  <!-- 校验功能表单 -->
  <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
      >
    <el-form-item label="名字" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <el-form-item label="颜色" prop="color">
      <el-select v-model="ruleForm.color" placeholder="颜色...">
        <el-option label="红色" value="shanghai" />
        <el-option label="蓝色" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="单选框" prop="resource">
      <el-radio-group v-model="ruleForm.resource">
        <el-radio value="Sponsorship">蓝色</el-radio>
        <el-radio value="Venue">Ven白色ue</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="多选框" prop="type">
      <el-checkbox-group v-model="ruleForm.type">
        <el-checkbox value="Online activities" name="type">
          红色
        </el-checkbox>
        <el-checkbox value="Promotion activities" name="type">
          蓝色
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="备注信息" prop="desc">
      <el-input v-model="ruleForm.desc" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitRuleForm(ruleFormRef)">
        Create
      </el-button>
      <el-button @click="resetRuleForm(ruleFormRef)">Reset</el-button>
    </el-form-item>

  </el-form>


  <el-card class="result-paging">

    <tabStream :tableColumns="addDocTableColumns" 
    :tableUrl="tableUrlAddDoc" 
    ref="tableComtRefAddDoc"/>


    <el-button type="primary" @click="submitRuleFormAddDoc()">
        获取表单数据
      </el-button>

  </el-card>
  
</template>
<script lang="ts" setup>
  import {reactive, ref} from 'vue'
  import type { ComponentSize, FormInstance, FormRules } from 'element-plus'

  
  import tabStream from '@/pages/test/testTableStream.vue'
  const tableUrlAddDoc = ref("");
  const tableComtRefAddDoc = ref(null);
  const addDocTableColumns = [
  { prop: 'actionDate', label: '日付' },
  { prop: 'actionContent', label: '対応履歴' },
  ]
  const submitRuleFormAddDoc = async () => {
    const tableData = tableComtRefAddDoc.value.getTableData();
    console.log('表データ:', tableData);
  }


  const form = reactive({
    name: '',
    color: '',
    date1: '',
    date2: '',
    colorCheckbox: [],
    asa: '',
  })

  const formLine = reactive({
    name: '',
    color: '',
  })

  const onSubmit = () =>{
    console.log("Submit!!!!!")
  }


  // 校验表单
  const formSize = ref<ComponentSize>('default')
  const ruleFormRef = ref<FormInstance>()

  const ruleForm = reactive({
    name: '',
    color: '',
    desc: '',
    resource: '',
  })

  const rules = reactive<FormRules<ruleForm>>({
    name: [
      { required: true, message: 'Please input Activity name', trigger: 'blur' },
      { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
    color: [
      { required: true, message: 'Please select Activity zone', trigger: 'change', },
    ],
    type: [
      { type: 'array', required: true, message: 'Please select at least one activity type',  trigger: 'change',
      },
    ],
    resource: [
      { required: true, message: 'Please select activity resource', trigger: 'change',},
    ],
    desc: [
      { required: true, message: 'Please input activity form', trigger: 'blur' },
    ],
  })
  const resetRuleForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }
  const submitRuleForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        console.log('submit!')
      } else {
        console.log('error submit!', fields)
      }
    })
  }



</script>

<style scoped>
  .form-inline .el-input{
    --el-input-width: 220px;
  }
  .form-inline .el-select {
    --el-select-width: 220px;
  }
</style>