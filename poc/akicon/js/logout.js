// 引入共通模块
// 假设使用 ES6 模块化，确保在 HTML 中正确引入模块
import { API_ENDPOINTS, showMessage, AKICON_TOKEN_KEY } from "./common.js";
import { BASE_URL } from "./httpHelper.js";


// 退出登录方法
function logout() {

   let akicon_token = sessionStorage.getItem(AKICON_TOKEN_KEY); // 从sessionStorage获取Token
   sessionStorage.removeItem(AKICON_TOKEN_KEY); // 将Token从sessionStorage删除
   console.log("Token已从sessionStorage:删除"); // 打印保存的Token

    // 使用Fetch API发送POST请求
    fetch(`${BASE_URL}/${API_ENDPOINTS.LOGOUT}`, {
        method: "POST", // 请求方法为POST
        headers: {
            'Authorization': `Bearer ${akicon_token}`,
            "Content-Type": "application/json", // 请求体为JSON格式
        }
    })
        .then((response) => {
            if (response.ok) {
                // 登录成功后跳转到主页
                window.location.href = "../index.html"; // 跳转到主页
            } else {
                throw new Error(`リクエストエラー: ${response.status}`); // 抛出HTTP错误
            }
        })
        .catch((error) => {
            console.error("请求失败:", error); // 打印错误信息
            showMessage("接続失敗しました。", "error"); // 提示错误信息
        });
    
}

// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", () => {

    const logoutButton = document.querySelector(".logout__btn");
    logoutButton.addEventListener("click", (event) => {
        event.preventDefault(); // 阻止表单默认提交行为
        logout(); // 调用登录表单提交方法
        clearDataGroup()(); // 清除数据组
    });
});
