# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

```aidl

引入列表, 并隐藏操作按钮, 单击选择并带回选择行数据
父组件==>
<!-- 跳转用户选择 -->
<el-dialog v-model="selectDialogVisible" title="ユーザーを選択してください" width="100%" heigth="100%">
  <sysUserList  @select-user="handleSelectUser" :isshowBtn="false"  ref="sysUserListRef"/>
</el-dialog>
// 跳转用户选择
const selectDialogVisible = ref(false)
const openSelectDialog = () => {
  console.log('Input value:', inputVal.value)
  selectDialogVisible.value = true;
}
const handleSelectUser = (userData: any) => {
  inputVal.value = userData.email
  selectDialogVisible.value = false
}

子组件==>

按钮: v-if="isshowBtn"

组件: TableComt  @row-click="handleRowClick"

props接受: const props = defineProps({
  isshowBtn: { type: Boolean, required: false, default: true },
})

Script函数: // 列表选择回传Start
               const emit = defineEmits(['select-user'])
const handleRowClick = (row) => {
debugger
console.log('Row clicked:', row)
if (row) {
emit('select-user', row)
}
}
// 列表选择回传Overall*/


```


```aiignore
2025年4月3日  需求变动，操作手册：
一, 实现功能: 
1. 样式优化
2. 按钮操作逻辑修改: U/D按钮放在行末, 新增按钮靠右, 双击行打开查看页
3. 优化颜色展示;
二,具体操作手册, 需要在所有List.vue修改
1. 删除删查改按钮（不包括新增），
2.   <TableComt 组件引用,  新增: 
  @edit-row="handleEditRow"  -- 触发修改方法handleEditRow()
  @del-row="handleDelRow"   -- 触发删除方法handleDelRow()
  @dbl-click-row="handleDblRow"   -- 触发查看方法handleDblRow()
  实现3个新方法, 测试完成后, 删除旧方法, 具体可参考bizCatList.vue
3. 在<script>标签内
import '~/assets/css/app.css';
```


```aiignore
文件上传
<FileUpload
          v-model:file-list="pcScreenshotListArray"
          :upload-url="'/sys/user/worker/screenshot'"
          :extra-form-data="[{ key: 'workerId', value: props.modelValue.id }]"
          :preview-url="'download'" :limit="5"
          :max-size-m-b="10"
          :enableGlobalDrop="true" />
          
:limit="5"
:max-size-m-b="10"
這兩個是限制
前端做的控制
若超過數量或大小 
就會阻擋上傳

:extra-form-data
這個是 worker_id
為了這元件能在別的地方能使用
所以放了這個
好讓 額外的主鍵數據帶入後端

:enableGlobalDrop
這是指全畫面文件拖拽
若是 false 或不存在 就是只有那小芳框可以拖拽

```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
