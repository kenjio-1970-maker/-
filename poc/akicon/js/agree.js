// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", initializeAgreePage);

function initializeAgreePage() {
  const agreeCheckbox = document.getElementById("agreeCheckbox");
  const agreeButton = document.querySelector(".agree__button");

  // 初始状态设置按钮为禁用
  agreeButton.disabled = true;
  agreeButton.style.backgroundColor = "#ccc"; // 设置未选中时的颜色

  // 当复选框状态改变时，更新按钮的禁用状态和颜色
  agreeCheckbox.addEventListener("change", () => {
    if (agreeCheckbox.checked) {
      agreeButton.disabled = false; // 启用按钮
      agreeButton.style.backgroundColor = "#22ac38"; // 设置选中时的鲜艳颜色
    } else {
      agreeButton.disabled = true; // 禁用按钮
      agreeButton.style.backgroundColor = "#ccc"; // 设置未选中时的颜色
    }
  });

  // 当点击按钮时，跳转到根目录的 index.html
  agreeButton.addEventListener("click", (event) => {
    event.preventDefault(); // 阻止表单默认提交行为
    window.location.href = "/akicon/form/form01.html"; // 跳转到根目录的 index.html
  });
}
