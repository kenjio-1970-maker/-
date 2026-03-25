import { showMessage, store, QUESTION_MARKS, getStoredItem, CHOICE_TYPE, bindNextButtonClickBySelect, populateCheckboxesFromStorage, getValueByName, populateInputField, populateRadioGroup, fetchAndPopulateAddress ,toHalfWidth} from "./common.js"; // 引入 fetchAndPopulateAddress
import { getAddressByPostalCode, BASE_URL } from "./httpHelper.js"; // 确保正确导入 BASE_URL
/* 页面加载完成后执行 */
document.addEventListener("DOMContentLoaded", initializePage);

/* 初始化页面的方法 */
function initializePage() {    
    setupSubmitButton(); // 设置提交按钮逻辑
    populateFormFields(); // 调用方法填充存储的数据到输入框
}

/* 抽离的提交按钮逻辑的方法 */
function setupSubmitButton() {
    const submitButton = document.querySelector(".next__btn");

    submitButton.addEventListener("click",async (event) => {
        event.preventDefault(); // 阻止默认跳转行为

        /* 获取所有值 */
        const formValues = getFormValues();

        /* 检查是否有错误信息 */
        if (formValues.errorMessage) {
            showMessage(formValues.errorMessage, "error");
            return; // 停止执行后续逻辑
        }

        /* 郵便番号の妥当性チェック*/
        const [success, message] = await getAddressByPostalCode(toHalfWidth(formValues.Q110401Start)+toHalfWidth(formValues.Q110401End))
        if (!success) {
            showMessage("住所の取得に失敗しました。正しい郵便番号を入力してください。", "error");
            return; // 停止执行后续逻辑
        }else {
            formValues.Q110402 = message;
        }
        /* 存储 */
        store(QUESTION_MARKS.Q110401Start, formValues.Q110401Start);
        store(QUESTION_MARKS.Q110401End, formValues.Q110401End);
        store(QUESTION_MARKS.Q110401, formValues.Q110401);
        store(QUESTION_MARKS.Q110402, formValues.Q110402);
        store(QUESTION_MARKS.Q110403, formValues.Q110403);
        store(QUESTION_MARKS.Q1105, formValues.Q1105);
        store(QUESTION_MARKS.Q1106, formValues.Q1106);
        store(QUESTION_MARKS.Q1107, formValues.Q1107);

        /* 跳转下一页 */
        window.location.href = submitButton.getAttribute("href");
    });
}

async function fetchAndPopulateAddressWrapper() {
    await fetchAndPopulateAddress(QUESTION_MARKS.Q110401Start, QUESTION_MARKS.Q110401End, QUESTION_MARKS.Q110402);
}

window.fetchAndPopulateAddress = fetchAndPopulateAddressWrapper; // 将方法挂载到 window 对象

/* 填充表单字段的方法 */
function populateFormFields() {
    populateInputField(QUESTION_MARKS.Q110401Start);
    populateInputField(QUESTION_MARKS.Q110401End);
    populateInputField(QUESTION_MARKS.Q110402);
    populateInputField(QUESTION_MARKS.Q110403);
    populateInputField(QUESTION_MARKS.Q1105);
    populateInputField(QUESTION_MARKS.Q1106);
    populateInputField(QUESTION_MARKS.Q1107);
}

/* 抽离的获取表单值的方法 */
function getFormValues() {
    // 错误信息
    let errorMessage = "";

    // 获取 Q11(4)-1-start end
    const Q110401Start = getValueByName(QUESTION_MARKS.Q110401Start);
    const Q110401End = getValueByName(QUESTION_MARKS.Q110401End);
    if (!Q110401Start || !Q110401End) {
        errorMessage += "郵便番号を入力してください。\n";
    }

    // 组合地址
    const Q110401 = Q110401Start + " - " + Q110401End;

    // 获取 Q11(4)-2
    const Q110402 = getValueByName(QUESTION_MARKS.Q110402);
    if (!Q110402) {
        errorMessage += "郵便番号をご入力のうえ、「検索」を押してください。\n";
    }

    // 获取 Q11(4)-3
    const Q110403 = getValueByName(QUESTION_MARKS.Q110403);
    if (!Q110403) {
        errorMessage += "番地を入力してください。\n";
    }

    // 获取 Q11(5)
    const Q1105 = getValueByName(QUESTION_MARKS.Q1105);
    if (!Q1105) {
        errorMessage += "ご実家の地番を入力してください。\n";
    }

    // 获取 Q11(6)
    const Q1106 = getValueByName(QUESTION_MARKS.Q1106);

    // 获取 Q11(7)
    const Q1107 = getValueByName(QUESTION_MARKS.Q1107);

    // 返回所有值
    return {
        Q110401Start,
        Q110401End,
        Q110401,
        Q110402,
        Q110403,
        Q1105,
        Q1106,
        Q1107,
        errorMessage,
    };
}


