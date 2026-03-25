import { BASE_URL } from "./httpHelper.js"; // 引入 fetchAndPopulateAddress

/* 页面加载完成后执行 */
document.addEventListener("DOMContentLoaded", initializePage);

/* 初始化页面的方法 */
function initializePage() {
    timeoutTransfer(); // 超时跳转
}

/* 超时跳转 */
function timeoutTransfer() {
    const timeout = 10 * 60 * 1000; // 设置超时时间为10分钟
    setTimeout(() => {
        window.location = BASE_URL; // 超时后跳转到指定页面
    }, timeout);
}
