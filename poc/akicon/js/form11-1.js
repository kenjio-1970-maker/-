import { showMessage, store, getStoredItem, QUESTION_MARKS, CHOICE_TYPE, bindNextButtonClickBySelect, populateCheckboxesFromStorage, getValueByName, populateInputField, populateRadioGroup } from "./common.js"; // 确保引入 getValueByName

/* 页面加载完成后执行 */
document.addEventListener("DOMContentLoaded", () => {
    setupSubmitButton(); // 调用方法设置提交按钮逻辑
    populateFormFields(); // 调用方法填充存储的数据到输入框
    watchQ110301(); // 监听 Q110301 的变化
});

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
        store(QUESTION_MARKS.Q1101, formValues.propertyOwnerName);
        store(QUESTION_MARKS.Q1102, formValues.relationship);
        store(QUESTION_MARKS.Q110301, formValues.isSameOwner);
        store(QUESTION_MARKS.Q110302, formValues.differentReason);

        /* 跳转下一页 */
        window.location.href = submitButton.getAttribute("href");
    });
}

/* 抽离的填充表单字段的方法 */
function populateFormFields() {
    populateInputField(QUESTION_MARKS.Q1101);
    populateInputField(QUESTION_MARKS.Q1102);
    populateRadioGroup(QUESTION_MARKS.Q110301);
    populateInputField(QUESTION_MARKS.Q110302);
}

/* 抽离的获取表单值的方法 */
function getFormValues() {
    // 错误信息
    let errorMessage = "";

    // 获取 (1) ご実家の不動産名義人氏名
    let propertyOwnerName = getValueByName(QUESTION_MARKS.Q1101);
    if (!propertyOwnerName) {
        errorMessage += "ご実家の不動産名義人氏名を入力してください。\n ";
    }

    // 获取 (2) 名義人と相談者様のご関係
    let relationship = getValueByName(QUESTION_MARKS.Q1102);
    if (!relationship) {
        errorMessage += "相談者様と名義人とのご関係を選択してください。\n ";
    }

    // 获取 (3) 土地と建物的名義人是否相同 (使用 name 获取)
    const isSameOwnerElement = document.querySelector('input[name="' + QUESTION_MARKS.Q110301 + '"]:checked');
    const isSameOwner = isSameOwnerElement ? isSameOwnerElement.value : null;
    if (!isSameOwner) {
        errorMessage += "土地と建物の名義人について選択してください。\n ";
    }

    // 获取 異なる理由
    let differentReason = getValueByName(QUESTION_MARKS.Q110302);
    if (isSameOwner === "0" && !differentReason) {
        errorMessage += "異なる理由を入力してください。\n ";
    }

    // 返回所有值
    return {
        propertyOwnerName,
        relationship,
        isSameOwner,
        differentReason,
        errorMessage,
    };
}

// 监听 Q110301 的变化
// 如果选择了 "0" (土地和建筑物的名义人不同)，则启用 "異なる理由" 字段
function watchQ110301() {
    const radioButtons = document.querySelectorAll('input[name="' + QUESTION_MARKS.Q110301 + '"]');
    const differentReasonField = document.querySelector('[name="' + QUESTION_MARKS.Q110302 + '"]');

    radioButtons.forEach((radio) => {
        radio.addEventListener("change", () => {
            if (radio.value === "0") {
                differentReasonField.disabled = false;
            } else {
                differentReasonField.disabled = true;
            }
        });
    });

    // 初始化时根据当前选中的单选按钮设置不同理由字段的禁用状态    
    if( getStoredItem(QUESTION_MARKS.Q110301) === "1") {
        differentReasonField.disabled = true;
    }   
}
