<template>
  <!-- <div class="login-container">
    <div class="login-form">
      <div class="input-container">
        ログイン
      </div>
      <el-form label-position="right" label-width="auto">
        <el-form-item label="ユーザ名" label-position="right">
          <el-input class="login-input" v-model="username" placeholder="ユーザ名を入力してください"></el-input>
          <CustomErrorMsg name="username">
            <p>{{ errors.username }}</p>
          </CustomErrorMsg>
        </el-form-item>

        <el-form-item label="パスワード" label-position="right">
          <el-input class="login-input" placeholder="パスワードを入力してください" v-model="password"
                    show-password></el-input>
          <CustomErrorMsg name="password">
            <p>{{ errors.password }}</p>
          </CustomErrorMsg>
        </el-form-item>
        <el-form-item>
          <p>{{ userStore.$state.errorMsg }}</p>
          <el-button type="primary" @click="submitloginForm" class="login-submit"><el-icon>
            <Right />
          </el-icon>ログイン</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div> -->
  <div class="login-container">

    <el-card class="box-card">
    <div slot="header" class="header-center">
      <span>実家じまい</span>
    </div>

    <el-form :model="form" class="form-style">
      <el-form-item>
        <el-input 
          placeholder="ユーザーID"
          v-model="username" 
          clearable 
          prefix-icon="User" 
          class="common-style input-style icon-style" 
          autofocus>
        </el-input>
      </el-form-item>
      <el-form-item class="relative-container">
        <el-input 
          placeholder="パスワード" 
          v-model="password" 
          show-password="true" 
          prefix-icon="Lock" 
          class="common-style input-style icon-style">
        </el-input>
        <!-- <span class="error-message" v-if="errorMessage">{{ errorMessage }}</span> -->
        <span class="error-message" v-if="errorMessage">{{ userStore.$state.errorMsg }}</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitloginForm" class="common-style button-style" >ログイン</el-button><!-- :loading="true" -->
      </el-form-item>
    </el-form>
  </el-card>

  </div>
   
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { User, Lock } from '@element-plus/icons-vue'; // 引入图标组件
import { ElIcon } from 'element-plus';
import '@/assets/css/components/login.css'; // 引入外部 CSS 文件

definePageMeta({
  layout: 'login-layout', // 指定使用不包含菜单的布局
});

// 注册图标组件
const components = { User, Lock, ElIcon };

// 定义表单数据
const form = ref({
  name: '',
  password: ''
});

// 定义错误信息
const errorMessage = ref('');

// 提交表单方法
const handleSubmit = () => {
  if (form.value.password !== 'correct_password') {
    errorMessage.value = '入力されたパスワードに誤りがあります。再度ご入力ください。';
  } else {
    errorMessage.value = '';
    console.log('フォームを送信する:', form.value);
  }
};




import { useField } from "vee-validate";
// import * as yup from 'yup';

// 状態管理とV-modelのバインディング
const userStore = useUserStore();

// 単項目チェックを定義
// const loginSchema = yup.object().shape({
//   username: yup.string().required().min(5).label('ユーザ名'),
//   password: yup.string().required().min(8).label('パスワード'),
// });

// // 単項目チェック実施
// const { errors } = useForm({
//   validationSchema: loginSchema,
// });

const { value: username } = useField('username');
const { value: password } = useField('password');

const submitloginForm = async () => {
  userStore.setLoginInfo(username.value as string, password.value as string);

  await userStore.signIn(
    (res) => {
      ElMessage.success("ようこそ、ログインしました。");
      navigateTo('/');
    },
    (err) => {
      ElMessage.error(err.msg);
    }
  );
};

</script>

<style scoped>
/* .login-icon {
  margin-right: 10px;
} */

.login-container {
  display: flex;
  justify-content: flex-start; /* 修改为左对齐 */
  align-items: center;
  height: 92vh;
  /* height: 100%; */
  background-image: url('/images/loginBg.jpg'); /* 添加背景图 */
  background-size: cover; /* 背景图適应容器 */
  background-position: center; /* 背景图居中 */
  padding-left: 100px; /* 添加左侧内边距，进一步调整位置 */
}

.login-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(231, 234, 237, 0.9); /* 添加透明背景色 */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 450px;
  height: 300px;
}

.input-container {
  margin-bottom: 15px;
  /* 適当な間隔を設定 */
}

.login-input {
  width: 300px;
}

.login-submit {
  margin-left: 280px;
}
</style>