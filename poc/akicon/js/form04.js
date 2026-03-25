import { QUESTION_MARKS, CHOICE_TYPE, bindNextButtonClickBySelect, populateCheckboxesFromStorage } from "./common.js"; // 引入 bindNextButtonClick

// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
  const checkboxes = document.querySelectorAll(".radio__inner input");
  const nextButton = document.querySelector(".next__btn");

  const questionMark = QUESTION_MARKS.Q4;

  // 绑定 next__btn 点击事件
  bindNextButtonClickBySelect(nextButton, CHOICE_TYPE.SINGLE, checkboxes, questionMark, true);

  // 从 sessionStorage 中获取数据并填充到页面
  populateCheckboxesFromStorage(checkboxes, questionMark);
}

