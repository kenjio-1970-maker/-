import { showMessage, store, validateInput, VALIDATION_FIELD, QUESTION_MARKS, getValueByName, populateInputField, populateRadioGroup, fetchAndPopulateAddress ,toHalfWidth} from "./common.js"; // 引入 fetchAndPopulateAddress
import { getAddressByPostalCode, BASE_URL } from "./httpHelper.js"; // 确保正确导入 BASE_URL

/* 页面加载完成后执行 */
document.addEventListener("DOMContentLoaded", initializePage);

/* 初始化页面的方法 */
function initializePage() {
    setupSubmitButton(); // 设置提交按钮逻辑
    populateFormFields(); // 填充表单字段
}

/* 抽离的提交按钮逻辑的方法 */
function setupSubmitButton() {
    const submitButton = document.querySelector(".next__btn");

    submitButton.addEventListener("click", async (event) => {
        event.preventDefault(); // 阻止默认跳转行为

        /* 获取所有值 */
        const formValues = getFormValues();

        /* 检查是否有错误信息 */
        if (formValues.errorMessage) {
            showMessage(formValues.errorMessage, "error");
            return; // 停止执行后续逻辑
        }

        /* 郵便番号の妥当性チェック*/
        const [success, message] = await getAddressByPostalCode(toHalfWidth(formValues.Q1204Start)+toHalfWidth(formValues.Q1204End))
        if (!success) {
            showMessage("住所の取得に失敗しました。正しい郵便番号を入力してください。", "error");
            return; // 停止执行后续逻辑
        } else {
            formValues.Q1205 = message;
        }

        /* 存储 */
        store(QUESTION_MARKS.Q1201, formValues.Q1201);
        store(QUESTION_MARKS.Q1202, formValues.Q1202);
        store(QUESTION_MARKS.Q1203, formValues.Q1203);
        store(QUESTION_MARKS.Q1204, formValues.Q1204);
        store(QUESTION_MARKS.Q1204Start, formValues.Q1204Start);
        store(QUESTION_MARKS.Q1204End, formValues.Q1204End);
        store(QUESTION_MARKS.Q1205, formValues.Q1205);
        store(QUESTION_MARKS.Q1206, formValues.Q1206);
        store(QUESTION_MARKS.Q1207, formValues.Q1207);
        store(QUESTION_MARKS.Q1208, formValues.Q1208);
        store(QUESTION_MARKS.Q1209, formValues.Q1209);

        /* 跳转下一页 */
        window.location.href = submitButton.getAttribute("href");
    });
}

/* 填充表单字段的方法 */
function populateFormFields() {
    populateInputField(QUESTION_MARKS.Q1201);
    populateInputField(QUESTION_MARKS.Q1201);
    populateInputField(QUESTION_MARKS.Q1202);
    populateInputField(QUESTION_MARKS.Q1203);
    populateInputField(QUESTION_MARKS.Q1204);
    populateInputField(QUESTION_MARKS.Q1204Start);
    populateInputField(QUESTION_MARKS.Q1204End);
    populateInputField(QUESTION_MARKS.Q1205);
    populateInputField(QUESTION_MARKS.Q1206);
    populateInputField(QUESTION_MARKS.Q1207);
    populateInputField(QUESTION_MARKS.Q1208);
    populateInputField(QUESTION_MARKS.Q1209);
}

/* 抽离的获取表单值的方法 */
function getFormValues() {
    // 错误信息
    let errorMessage = "";

    // 获取 Q12(1)-start end
    const Q1204Start = getValueByName(QUESTION_MARKS.Q1204Start);
    const Q1204End = getValueByName(QUESTION_MARKS.Q1204End);
    if (!Q1204Start || !Q1204End) {
        errorMessage += "郵便番号を入力してください。\n";
    }

    // 组合邮政编码
    const Q1204 = Q1204Start + " - " + Q1204End;

    // 获取其他字段
    const Q1201 = getValueByName(QUESTION_MARKS.Q1201);
    const Q1202 = getValueByName(QUESTION_MARKS.Q1202);
    const Q1203 = getValueByName(QUESTION_MARKS.Q1203);
    const Q1205 = getValueByName(QUESTION_MARKS.Q1205);
    const Q1206 = getValueByName(QUESTION_MARKS.Q1206);
    const Q1207 = getValueByName(QUESTION_MARKS.Q1207);
    const Q1208 = getValueByName(QUESTION_MARKS.Q1208);
    const Q1209 = getValueByName(QUESTION_MARKS.Q1209);

    // 必填项校验
    if (!Q1201) {
        errorMessage += "名前を入力してください。\n";
    }
    if (!Q1202) {
        errorMessage += "ふりがなを入力してください。\n";
    }
    if (!Q1203) {
        errorMessage += "電話番号を入力してください。\n";
    }
    if (!Q1206) {
        errorMessage += "番地を入力してください。\n";
    }
        
    // 校验电话号码
    const [isValid, phoneErrorMessage] = validateInput(Q1203, VALIDATION_FIELD.PHONE);
    if (!isValid) {
        errorMessage += phoneErrorMessage + "\n"; // 添加错误信息
    }

    // 返回所有值
    return {
        Q1201,
        Q1202,
        Q1203,
        Q1204,
        Q1204Start,
        Q1204End,
        Q1205,
        Q1206,
        Q1207,
        Q1208,
        Q1209,
        errorMessage,
    };
}

async function fetchAndPopulateAddressWrapper() {
    await fetchAndPopulateAddress(QUESTION_MARKS.Q1204Start, QUESTION_MARKS.Q1204End, QUESTION_MARKS.Q1205);
}

window.fetchAndPopulateAddress = fetchAndPopulateAddressWrapper; // 将方法挂载到 window 对象