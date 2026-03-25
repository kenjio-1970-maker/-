// 引入共通模块
// 假设使用 ES6 模块化，确保在 HTML 中正确引入模块
import { API_ENDPOINTS, showMessage, AKICON_TOKEN_KEY } from "./common.js";
import { BASE_URL } from "./httpHelper.js";

// 登录表单提交方法
function submitLoginForm() {
    const username = document.getElementById("username").value; // 获取用户名输入值
    const password = document.getElementById("password").value; // 获取密码输入值

    // 检查用户名和密码是否为空
    if (!username || !password) {
        showMessage("IDとパスワードを入力してください。", "error"); // 提示用户输入用户名和密码
        return;
    }

    // 使用Fetch API发送POST请求
    fetch(`${BASE_URL}/${API_ENDPOINTS.LOGIN}`, {
        method: "POST", // 请求方法为POST
        headers: {
            "Accept": "application/json", // 接受JSON格式的响应
            "Content-Type": "application/json", // 请求体为JSON格式
        },
        body: JSON.stringify({ email: username, password: password }), // 将表单数据转换为JSON字符串
    })
        .then((response) => {
            if (response.ok) {
                return response.json(); // 如果响应成功，解析为JSON
            } else {
                throw new Error(`リクエストエラー: ${response.status}`); // 抛出HTTP错误
            }
        })
        .then((data) => {
            if (data.fail) {
                showMessage(`ログインに失敗しました。IDまたはパスワードが正しくありません。`, "error"); // 提示后台返回错误
                return;
            }

            // 登录成功后，仅保存Token到sessionStorage
            sessionStorage.setItem(AKICON_TOKEN_KEY, data.token); // 将Token保存到sessionStorage
            console.log("Token已保存到sessionStorage:", data.token); // 打印保存的Token

            console.log("登录成功:", data); // 打印登录成功信息
            showMessage("ログイン成功しました！", "success"); // 提示登录成功

            // 登录成功后跳转到主页
            window.location.href = "./slide00/index.html"; // 跳转到主页
        })
        .catch((error) => {
            console.error("请求失败:", error); // 打印错误信息
            showMessage("接続失敗しました。", "error"); // 提示错误信息
        });
}


// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", () => {

    // 自动获取地址栏中的 message 参数并打印
    // printMessageFromURL();

    const loginButton = document.querySelector(".login__btn");
    loginButton.addEventListener("click", (event) => {
        event.preventDefault(); // 阻止表单默认提交行为
        submitLoginForm(); // 调用登录表单提交方法
    });
});

// // 自动获取地址栏中的 message 参数并打印
// function printMessageFromURL() {
//     const urlParams = new URLSearchParams(window.location.search); // 获取地址栏参数
//     const message = urlParams.get("message"); // 获取 message 参数
//     if (message) {
//         console.log("地址栏中的 message 参数:", message); // 打印 message 参数
//         showMessage(message, "info"); // 显示 message 提示信息
//     }
// }