import { AKICON_TOKEN_KEY, showMessage } from "./common.js"; // 修正为相对路径

// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", () => {

  // 页面加载完成后自动调用的逻辑
  checkTokenExistence();
});

// 页面加载完成后自动调用的函数
function checkTokenExistence() {

  // 检查 sessionStorage 中是否存在 Token
  const token = sessionStorage.getItem(AKICON_TOKEN_KEY);
  if (!token) {
    console.warn("Token 不存在，跳转到登录页面..."); // 打印警告日志
    // showMessage("请您登录", "success"); // 提示错误信息
    window.location.href = "/akicon/"; // 使用全路径跳转到登录页面
    return;
  }

  console.log("Token 存在，页面初始化完成。"); // 打印成功日志
}


// 如果是从缓存加载的页面，强制刷新或清理
window.addEventListener("pageshow", function(event) {   
    if (event.persisted) {
        console.log("页面从 bfcache 恢复，强制刷新或清理。"); // 打印日志
        // 如果是从 bfcache 恢复（即浏览器缓存），强制刷新或清理
        // clearDataGroup(); // 你的清理方法
        window.location.reload(); // 或者强制刷新页面
    }else {
        console.log("页面正常加载。"); // 打印日志
    }
});
