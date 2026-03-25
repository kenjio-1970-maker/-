// // 后端基础URL
// const BASE_URL = "http://localhost:8080/jikajimai"; // 修改为HTTP协议

// // API接口名称
// const API_ENDPOINTS = {
//   LOGIN: "auth/login", // 登录接口
//   REGISTER: "register.php", // 注册接口
//   FORGOT_PASSWORD: "forgot_password.php", // 忘记密码接口
// };

// // 消息弹出提示方法
// function showMessage(message, type = "info") {
//   const messageContainer = document.createElement("div");
//   messageContainer.className = `message-popup ${type}`;
//   messageContainer.textContent = message;

//   // 将消息弹出框放置在页面顶部并水平居中
//   messageContainer.style.position = "fixed";
//   messageContainer.style.top = "20px";
//   messageContainer.style.left = "50%";
//   messageContainer.style.transform = "translate(-50%, 0)"; // 水平居中

//   document.body.appendChild(messageContainer);

//   // 自动移除消息提示
//   setTimeout(() => {
//     messageContainer.remove();
//   }, 3000); // 3秒后自动消失
// }

// // 登录表单提交方法
// function submitLoginForm() {
//   const username = document.getElementById("username").value; // 获取用户名输入值
//   const password = document.getElementById("password").value; // 获取密码输入值

//   // 检查用户名和密码是否为空
//   if (!username || !password) {
//     if (!document.querySelector(".alert-shown")) {
//       showMessage("IDとパスワードを入力してください。", "error"); // 提示用户输入用户名和密码
//     }
//     return;
//   }

//   // 创建表单数据对象
//   const formData = new FormData();
//   formData.append("email", username); // 添加用户名到表单数据
//   formData.append("password", password); // 添加密码到表单数据

//   // 使用Fetch API发送POST请求
//   fetch(`${BASE_URL}/${API_ENDPOINTS.LOGIN}`, {
//     method: "POST", // 请求方法为POST
//     headers: {
//       "Accept": "application/json", // 接受JSON格式的响应
//       "Content-Type": "application/json", // 请求体为JSON格式
//     },
//     body: JSON.stringify({ email: username, password: password }), // 将表单数据转换为JSON字符串
//   })
//     .then((response) => {
//       debugger;
//       if (response.ok) {
//         return response.json(); // 如果响应成功，解析为JSON
//       } else {
//         throw new Error(`HTTP错误: ${response.status}`); // 抛出HTTP错误
//       }
//     })
//     .then((data) => {
//       debugger;
//       if (data.fail) {
//         showMessage(`登录失败: ${data.msg}`, "error"); // 提示后台返回错误
//         return;
//       }
//       console.log("登录成功:", data); // 打印登录成功信息
//       showMessage("登录成功！", "success"); // 提示登录成功
//     })
//     .catch((error) => {
//       console.error("请求失败:", error); // 打印错误信息
//       showMessage("请求失败，请检查网络或服务器配置。", "error"); // 提示错误信息
//     });
// }
