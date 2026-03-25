import { getAddressByPostalCode, BASE_URL } from "./httpHelper.js"; // 确保正确导入 BASE_URL

// 常量定义
export const AKICON_TOKEN_KEY = "akiconToken"; // 用于存储Token的键名

// API接口名称
export const API_ENDPOINTS = {
    LOGIN: "auth/login", // 登录接口
    REGISTER: "register.php", // 注册接口
    FORGOT_PASSWORD: "forgot_password.php", // 忘记密码接口
};

// 校验相关的正则表达式常量
export const VALIDATION_FIELD = {
    EMAIL: "EMAIL", // 邮箱格式校验
    PHONE: "PHONE", // 电话号码校验（10到15位数字）
    POSTAL_CODE: "POSTAL_CODE", // 日本邮政编码格式（如 123-4567 或 1234567）
    PASSWORD: "PASSWORD", // 密码校验（至少8位，包含字母和数字）
    URL: "URL", // URL格式校验
};

// 校验相关的正则表达式常量
export const VALIDATION_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // 邮箱格式校验
    PHONE: /^[0-9０-９]{10,15}$/, // 电话号码校验（10到15位数字）
    POSTAL_CODE: /^\d{3}-?\d{4}$/, // 日本邮政编码格式（如 123-4567 或 1234567）
    PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, // 密码校验（至少8位，包含字母和数字）
    URL: /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-]*)*\/?$/, // URL格式校验
};

export const VALIDATION_MESSAGES = {
    EMAIL: "正しいメールアドレスを入力してください。",
    PHONE: "正しい電話番号を入力してください。（10〜11桁の数字）",
    POSTAL_CODE: "正しい郵便番号を入力してください（例: 123-4567）。",
    PASSWORD: "パスワードは8文字以上で、英字と数字を含めてください。",
    URL: "正しいURLを入力してください。",
    DEFAULT: "入力が無効です。",
};

// todo

// 问题标识
export const QUESTION_MARKS = {
    Q1: "Q1",
    Q2: "Q2",
    Q3: "Q3",
    Q4: "Q4",
    Q5: "Q5",
    Q6: "Q6",
    Q7: "Q7",
    Q8: "Q8",
    Q9: "Q9",
    Q10: "Q10",
    Q1101: "Q11(1)",
    Q1102: "Q11(2)",
    Q110301: "Q11(3)-1",
    Q110302: "Q11(3)-2",
    Q110401Start: "Q11(4)-1-start",
    Q110401End: "Q11(4)-1-end",
    Q110401: "Q11(4)-1",
    Q110402: "Q11(4)-2",
    Q110403: "Q11(4)-3",
    Q1105: "Q11(5)",
    Q1106: "Q11(6)",
    Q1107: "Q11(7)",
    Q1201: "Q12(1)",
    Q1202: "Q12(2)",
    Q1203: "Q12(3)",
    Q1204: "Q12(4)",
    Q1204Start: "Q12(4)-start",
    Q1204End: "Q12(4)-end",
    Q1205: "Q12(5)",
    Q1206: "Q12(6)",
    Q1207: "Q12(7)",
    Q1208: "Q12(8)",
    Q1209: "Q12(9)",
    Q130101: "Q13(1)-1",
    Q130102: "Q13(1)-2",
    Q130102Again: "Q13(1)-2-again",
    Q130201: "Q13(2)-1",
    Q130202: "Q13(2)-2",
    Q130202Again: "Q13(2)-2-again",

    
};

export const CHOICE_TYPE = {
    SINGLE: 1,
    MULTI: 2,
};

// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", () => {

    // 自动获取地址栏中的 message 参数并打印
    printMessageFromURL();

    // 自动加载确认模态框
    loadConfirmModal();
});

// 消息弹出提示方法
export function showMessage(message, type = "info") {
    const messageContainer = document.createElement("div");
    messageContainer.className = `message-popup ${type}`;
    messageContainer.innerHTML = message.replace(/\n/g, "<br>"); // 替换 \n 为 <br> 并使用 innerHTML

    // 将消息弹出框放置在页面顶部并水平居中
    messageContainer.style.position = "fixed";
    messageContainer.style.top = "20px";
    messageContainer.style.left = "50%";
    messageContainer.style.transform = "translate(-50%, 0)"; // 水平居中
    messageContainer.style.padding = "15px 30px"; // 增大字体
    messageContainer.style.maxWidth = "80%"; // 设置最大宽度
    messageContainer.style.textAlign = "center"; // 居中文本
    messageContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)"; // 设置半透明背景，降低透明度
    messageContainer.style.color = "#fff"; // 设置文字颜色为白色
    messageContainer.style.borderRadius = "5px"; // 添加圆角

    document.body.appendChild(messageContainer);

    // 自动移除消息提示
    setTimeout(() => {
        messageContainer.remove();
    }, 3000); // 3秒后自动消失
}

// 自动获取地址栏中的 message 参数并打印
function printMessageFromURL() {
    const urlParams = new URLSearchParams(window.location.search); // 获取地址栏参数
    const message = urlParams.get("message"); // 获取 message 参数
    if (message) {
        console.log("地址栏中的 message 参数:", message); // 打印 message 参数
        showMessage(message, "info"); // 显示 message 提示信息
    }
}

// 处理选择框的方法
export function  handleSelection(callback, choiceType, checkboxes, questionMark, isRequired) {
  const selectedValues = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  // 如果选择不是必填且没有选中任何值，直接跳转
  if (!isRequired && selectedValues.length === 0) {
    return callback();
  }

  // 多选逻辑
  if (choiceType === CHOICE_TYPE.MULTI) {
    if (selectedValues.length > 0) {
      store(questionMark, selectedValues);
      return callback();
    } else {
      return showMessage("必須項目が未入力です。", "error");
    }
  }

  // 单选逻辑
  if (choiceType === CHOICE_TYPE.SINGLE) {
    if (selectedValues.length > 1) {
      return showMessage("1つのオプションのみを選択してください。", "error");
    }
    if (selectedValues.length === 0) {
      return showMessage("必須項目が未入力です。", "error");
    }
    store(questionMark, selectedValues[0]);
    return callback();
  }

  // 未知的 choiceType
  showMessage("無効な選択タイプです。", "error");
}

// 默认分组常量
const SESSION_GROUP = "akiconFormData";

/**
 * 存储数据到 sessionStorage 的方法（使用默认分组）
 * @param {string} questionMark - 存储的键名
 * @param {any} value - 存储的值
 */
export function store(questionMark, value) {
    const groupedData = JSON.parse(sessionStorage.getItem(SESSION_GROUP)) || {};
    groupedData[questionMark] = value; // 更新分组中的键值
    sessionStorage.setItem(SESSION_GROUP, JSON.stringify(groupedData)); // 存储分组数据
    console.log(`保存到 sessionStorage 分组 "${SESSION_GROUP}":`, groupedData);
}

/**
 * 从 sessionStorage 获取数据的方法（使用默认分组）
 * @param {string} key - 存储的键名
 * @returns {any} - 解析后的数据，如果不存在则返回 null
 */
export function getStoredItem(key) {
    const groupedData = JSON.parse(sessionStorage.getItem(SESSION_GROUP)) || {};
    return groupedData[key] || null; // 返回分组中的指定键值
}

/**
 * 获取默认分组中所有数据的方法
 * @returns {Object} - 返回分组中的所有数据，如果不存在则返回空对象
 */
export function getDataGroup() {
    const groupedData = JSON.parse(sessionStorage.getItem(SESSION_GROUP)) || {};
    return groupedData; // 返回分组中的所有数据
}

/**
 * 删除默认分组中的所有数据的方法
 */
export function clearDataGroup() {
    sessionStorage.removeItem(SESSION_GROUP); // 删除整个分组
    console.log(`已删除 sessionStorage 分组 "${SESSION_GROUP}"`);
}

// 抽离的绑定 next__btn 点击事件的方法
export function bindNextButtonClickBySelect(nextButton, choiceType, checkboxes, questionMark, isRequired) {
  nextButton.addEventListener("click", (event) => {
    event.preventDefault(); // 阻止默认跳转行为
    handleSelection(() => {
      window.location.href = nextButton.getAttribute("href"); // 跳转到 a 标签的 href
    }, choiceType, checkboxes, questionMark, isRequired);
  });
}

/**
 * 从 sessionStorage 获取数据并填充到页面的方法（使用默认分组）
 * @param {NodeList} checkboxes - 复选框元素列表
 * @param {string} questionMark - 存储的键名
 */
export function populateCheckboxesFromStorage(checkboxes, questionMark) {
    const storedValue = getStoredItem(questionMark);
    if (storedValue) {
        checkboxes.forEach((checkbox) => {
            if (storedValue.includes(checkbox.value)) {
                checkbox.checked = true; // 选中复选框
            }else {
                checkbox.checked = false; // 取消选中
            }
        });
    }
}

/* 填充单个输入框的方法（从存储中获取值） */
export function populateInputField(name) {
    const storedValue = getStoredItem(name);
    const element = document.querySelector('[name="' + name + '"]');
    if (element && storedValue) {
        element.value = storedValue; // 填充数据
    }else {
        if(element) {// 如果元素存在
            element.value = ""; // 清空数据
        }
        
    }
}

/* 填充单选框组的方法（从存储中获取值） */
export function populateRadioGroup(name) {
    const storedValue = getStoredItem(name);
    const elements = document.querySelectorAll('input[name="' + name + '"]');
    if (elements && storedValue) {
        elements.forEach((element) => {
            if (element.value === storedValue) {
                element.checked = true; // 选中对应的单选框
            }else {
                element.checked = false; // 取消选中
            }
        });
    }
}

/* 抽离的通过 name 获取数据的方法 */
export function getValueByName(name) {
    const element = document.querySelector('[name="' + name + '"]');
    return element ? element.value.trim() : "";
}

/**
 * 将全角字符转换为半角字符
 * @param {string} str - 输入字符串
 * @returns {string} - 转换后的字符串
 */
export function toHalfWidth(str) {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (char) =>
        String.fromCharCode(char.charCodeAt(0) - 0xfee0)
    );
}

/* 根据邮政编码获取地址并填充 */
export async function fetchAndPopulateAddress(startKey, endKey, addressKey) {
    let postalCodeStart = document.querySelector(`input[name="${startKey}"]`)?.value.trim() || "";
    let postalCodeEnd = document.querySelector(`input[name="${endKey}"]`)?.value.trim() || "";

    if (!postalCodeStart || !postalCodeEnd) {
        showMessage("郵便番号を入力してください。", "error");
        return;
    }

    // 转换为半角字符
    postalCodeStart = toHalfWidth(postalCodeStart);
    postalCodeEnd = toHalfWidth(postalCodeEnd);
    const postalCode = postalCodeStart + postalCodeEnd; // 拼接完整邮政编码

    const [isSuccess, message] = await getAddressByPostalCode(postalCode); // 调用 getAddressByPostalCode
    if (isSuccess) {
        const addressElement = document.querySelector(`input[name="${addressKey}"]`);
        if (addressElement) {
            addressElement.value = message; // 填充地址字段
        } else {
            console.error(`Element with name "${addressKey}" not found.`);
        }
    } else {
        showMessage("住所の取得に失敗しました。正しい郵便番号を入力してください。", "error"); // 显示错误信息
    }
}

/* 获取多选框或单选框的值 */
export function getCheckedValuesByName(name) {
    const elements = document.querySelectorAll('[name="' + name + '"]');
    const checkedValues = Array.from(elements)
        .filter((element) => element.checked)
        .map((element) => element.value.trim());
    
    // 如果是单选框，返回第一个值；如果是多选框，返回数组
    return checkedValues;
}

// 加载确认框
export function loadConfirmModal() {
    const modalContainer = document.getElementById("confirmModalContainer");
    if (modalContainer) {
    fetch("../components/confirmModal.html")
        .then(response => response.text())
        .then(html => {
        modalContainer.innerHTML = html;
        })
        .catch(error => console.error("Error loading confirm modal:", error));
    }
}

// 显示确认框
window.showConfirmModal = showConfirmModal; // 将方法挂载到 window 对象
export function showConfirmModal() {
    const modal = document.getElementById("confirmModal");
    modal.classList.remove("hidden");

    // 获取按钮
    const confirmYes = document.getElementById("confirmYes");
    const confirmNo = document.getElementById("confirmNo");

    // 确认返回首页
    confirmYes.onclick = function () {
      clearDataGroup(); // 清除数据
      modal.classList.add("hidden");
      window.location.href = "../slide00/"; // 跳转到首页
    };

    // 取消操作
    confirmNo.onclick = function () {
      modal.classList.add("hidden");
    };

    // 阻止默认跳转行为
    return false;
  }

/**
 * 校验输入值的方法
 * @param {string} value - 要校验的值
 * @param {string} type - 校验类型（如 "EMAIL", "PHONE" 等）
 * @returns {Array} - [true] 校验成功, [false, "エラーメッセージ"] 校验失败
 */
export function validateInput(value, type) {
    const pattern = VALIDATION_PATTERNS[type];
    if (!pattern) {
        console.error("無効な検証タイプが指定されました。");
        return [false, VALIDATION_MESSAGES.DEFAULT];
    }
    if (pattern.test(value.trim())) {
        return [true]; // 校验成功
    } else {
        const errorMessage = VALIDATION_MESSAGES[type] || VALIDATION_MESSAGES.DEFAULT;
        return [false, errorMessage]; // 校验失败
    }
}

/* 设置自动跳转到下一个输入框的函数 */
export function setupAutoMoveToNextInput(startKey, endKey ,startPosition = 3) {
    const inputStart = document.querySelector(`input[name="${startKey}"]`);
    const inputEnd = document.querySelector(`input[name="${endKey}"]`);
    let isComposing = false;
    inputStart.addEventListener("compositionstart", () => { isComposing = true; });
    inputStart.addEventListener("compositionend", () => {
        isComposing = false;
        if (inputStart.value.length === 3) {
            inputEnd.focus();
        }
    });
    inputStart.addEventListener("input", () => {
            if (inputStart.value.length === startPosition ) {
                inputEnd.focus(); // Move to the next input
            }
        });
}

// 示例用法
// const [isValid, errorMessage] = validateInput("test@example.com", "EMAIL");
// console.log(isValid, errorMessage); // true 或 false, 错误信息

// Correct usage
// const [isValid, errorMessage] = validateInput("09012345678", "PHONE");
// console.log(isValid, errorMessage); // true 或 false, 错误信息
