import { showMessage, store, getStoredItem, getCheckedValuesByName, validateInput, VALIDATION_FIELD, QUESTION_MARKS, getValueByName, populateInputField, populateRadioGroup } from "./common.js";

/* 页面加载完成后执行 */
document.addEventListener("DOMContentLoaded", initializePage);

/* 初始化页面的方法 */
function initializePage() {
    setupSubmitButton(); // 设置提交按钮逻辑
    populateFormFields(); // 填充表单字段
    setupReportMethodChangeHandler(); // 调用监听方法
}

/* 抽离的提交按钮逻辑的方法 */
function setupSubmitButton() {
    const submitButton = document.querySelector(".next__btn");

    submitButton.addEventListener("click", (event) => {
        event.preventDefault(); // 阻止默认跳转行为

        /* 获取所有值 */
        const formValues = getFormValues();

        /* 检查是否有错误信息 */
        if (formValues.errorMessage) {
            showMessage(formValues.errorMessage, "error");
            return; // 停止执行后续逻辑
        }

        /* 存储 */
        store(QUESTION_MARKS.Q130101, formValues.Q130101[0]);
        store(QUESTION_MARKS.Q130102, formValues.Q130102);
        store(QUESTION_MARKS.Q130102Again, formValues.Q130102Again);
        store(QUESTION_MARKS.Q130201, formValues.Q130201);
        store(QUESTION_MARKS.Q130202, formValues.Q130202);
        store(QUESTION_MARKS.Q130202Again, formValues.Q130202Again);

        setupReportMethodChangeHandler(); // 调用监听方法
        
        /* 跳转下一页 */
        window.location.href = submitButton.getAttribute("href");
    });
}

/* 填充表单字段的方法 */
function populateFormFields() {
    populateRadioGroup(QUESTION_MARKS.Q130101);
    populateInputField(QUESTION_MARKS.Q130102);
    populateInputField(QUESTION_MARKS.Q130102Again);
    populateInputField(QUESTION_MARKS.Q130201);
    populateInputField(QUESTION_MARKS.Q130202);
    populateInputField(QUESTION_MARKS.Q130202Again);
}

/* 抽离的获取表单值的方法 */
function getFormValues() {
    // 错误信息
    let errorMessage = "";

    const Q130101 = getCheckedValuesByName(QUESTION_MARKS.Q130101);
    const Q130102 = getValueByName(QUESTION_MARKS.Q130102);
    const Q130102Again = getValueByName(QUESTION_MARKS.Q130102Again);
    const Q130201 = getValueByName(QUESTION_MARKS.Q130201);
    const Q130202 = getValueByName(QUESTION_MARKS.Q130202);
    const Q130202Again = getValueByName(QUESTION_MARKS.Q130202Again);


    // 获取 (1) レポート送付希望手段
    if (!Q130101 || (Array.isArray(Q130101) && Q130101.length === 0)) {
        errorMessage += "レポート送付希望手段を選択してください。\n";
    }

    if (Array.isArray(Q130101) && Q130101.length > 1) {
        errorMessage += "レポート送付希望手段を1つ選択してください。\n";
    }

    if((Q130202 || Q130202Again) && !Q130201){
        errorMessage += "宛名を入力してください。\n";
    }

    if((!Q130202 || !Q130202Again) && Q130201){
        errorMessage += "送付先を入力してください。\n";
    }

    if (Q130202 !== Q130202Again) {
        errorMessage += "送付先が一致しません。\n";
    }


    if (Q130202){
        const [isValid, emailErrorMessage] = validateInput(Q130202, VALIDATION_FIELD.EMAIL);
        if (!isValid) {
            errorMessage += emailErrorMessage + "\n"; // 添加错误信息
        }
    }
    

    // メールアドレス
    if (Q130101[0] === "1") {
        if (!Q130102) {
            errorMessage += "メールアドレスを入力してください。\n";
        }
        if (Q130102 !== Q130102Again) {
            errorMessage += "メールアドレスが一致しません。\n";
        }
        
        const [isValid, emailErrorMessage] = validateInput(Q130102, VALIDATION_FIELD.EMAIL);
        if (Q130102 && Q130102 == Q130102Again && !isValid) {
            errorMessage += emailErrorMessage + "\n"; // 添加错误信息
        }
    }

    // 返回所有值
    return {
        Q130101,
        Q130102,
        Q130102Again,
        Q130201,
        Q130202,
        Q130202Again,
        errorMessage,
    };
}

/* 监听 name="Q13(1)-1" 字段的变动并实时处理 */
function setupReportMethodChangeHandler() {
    const reportMethodRadios = document.querySelectorAll('input[name="Q13(1)-1"]');
    reportMethodRadios.forEach((radio) => {
        radio.addEventListener("change", (event) => {
            const selectedValue = event.target.value;

            // 获取相关字段
            const emailFields = document.querySelectorAll('input[name="Q13(1)-2"], input[name="Q13(1)-2-again"]');
            const postalFields = document.querySelectorAll('input[name="Q13(2)-1"], input[name="Q13(2)-2"], input[name="Q13(2)-2-again"]');

            if (selectedValue === "1") {
                // 邮件选项被选中
                console.log("メールを希望するが選択されました。");
                emailFields.forEach(input => input.disabled = false); // 启用邮件地址输入框
            } else if (selectedValue === "2") {
                // 邮送选项被选中
                console.log("郵送を希望するが選択されました。");
                emailFields.forEach(input => input.disabled = true); // 禁用邮件地址输入框
            }
        });
    });
}
