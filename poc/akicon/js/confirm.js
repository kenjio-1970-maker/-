import { getStoredItem, QUESTION_MARKS, getDataGroup, clearDataGroup, showMessage } from "./common.js";
import { sendFormDataToServer } from "./httpHelper.js"; // 引入 sendFormDataToServer

/* 页面加载完成后执行 */
document.addEventListener("DOMContentLoaded", populateConfirmationData);

/* 填充确认页面数据的方法 */
function populateConfirmationData() {

    //現在お住まいのご住所
    document.getElementById("confirm_addr_1").innerHTML = "";
    document.getElementById("confirm_addr_2").innerHTML =  "";
    document.getElementById("confirm_addr_3").innerHTML = "";
    //お名前
    document.getElementById("confirm_name").innerHTML = "";
    //フリガナ
    document.getElementById("confirm_kana").innerHTML = "";
    //電話番号
    document.getElementById("confirm_tel").innerHTML = "";
    //年齢
    document.getElementById("confirm_age").innerHTML = "";
    //性別
    document.getElementById("confirm_sex").innerHTML = "";
    //ご職業
    document.getElementById("confirm_job").innerHTML = "";
    //レポート送付希望手段
    document.getElementById("confirm_shudan").innerHTML = "";
    //別送付先（任意）
    document.getElementById("confirm_soufu_atena").innerHTML = "";
    document.getElementById("confirm_soufu_mail").innerHTML = "";


    const data = getDataGroup(); // 从分组中获取所有数据

    // 过滤掉以 start、end 或 again 结尾的字段
    const filteredData = Object.keys(data).reduce((result, key) => {
        if (!key.endsWith("start") && !key.endsWith("end") && !key.endsWith("again")) {
            result[key] = data[key];
        }
        return result;
    }, {});

    //現在お住まいのご住所
    document.getElementById("confirm_addr_1").innerHTML = `〒${data["Q12(4)-start"] || ""}-${data["Q12(4)-end"] || ""}`;
    document.getElementById("confirm_addr_2").innerHTML = filteredData["Q12(5)"] || "";
    document.getElementById("confirm_addr_3").innerHTML = filteredData["Q12(6)"] || "";
    //お名前
    document.getElementById("confirm_name").innerHTML = filteredData["Q12(1)"] || "";
    //フリガナ
    document.getElementById("confirm_kana").innerHTML = filteredData["Q12(2)"] || "";
    //電話番号
    document.getElementById("confirm_tel").innerHTML = filteredData["Q12(3)"] || "";
    //年齢
    document.getElementById("confirm_age").innerHTML = mapAge(filteredData["Q12(7)"]);
    //性別
    document.getElementById("confirm_sex").innerHTML = mapGender(filteredData["Q12(8)"]);
    //ご職業
    document.getElementById("confirm_job").innerHTML = mapJob(filteredData["Q12(9)"]);
    //レポート送付希望手段
    const reportMethod = filteredData["Q13(1)-1"] === "2" ? "郵送" : "メール";
    const email = filteredData["Q13(1)-1"] === "2" ? "現在お住まいのご住所" : filteredData["Q13(1)-2"] || "";
    document.getElementById("confirm_shudan").innerHTML = `${reportMethod}（${email}）`;
    //別送付先（任意）
    document.getElementById("confirm_soufu_atena").innerHTML = `宛名：${filteredData["Q13(2)-1"] || ""}`;
    document.getElementById("confirm_soufu_mail").innerHTML = `メール：${filteredData["Q13(2)-2"] || ""}`;

}

/* 映射年龄 */
function mapAge(value) {
    const ageMap = {
        "1": "10代以下",
        "2": "20代",
        "3": "30代",
        "4": "40代",
        "5": "50代",
        "6": "60代",
        "7": "70代以上",
    };
    return ageMap[value] || "未選択";
}

/* 映射性别 */
function mapGender(value) {
    const genderMap = {
        "1": "女性",
        "2": "男性",
        "3": "その他",
        "4": "回答しない",
    };
    return genderMap[value] || "未選択";
}

/* 映射职业 */
function mapJob(value) {
    const jobMap = {
        "1": "会社員・役員",
        "2": "自営業",
        "3": "公務員",
        "4": "学生",
        "5": "専業主婦",
        "6": "パート・アルバイト",
        "7": "無職",
        "8": "その他",
    };
    return jobMap[value] || "未選択";
}

/* 送信按钮点击事件 */
export async function handleSubmit() {
    console.log("送信ボタンがクリックされました。");
    const ret = await _handleSubmit();
    console.log("送信結果:", ret); // 打印返回值
    if (ret === 1) {
        // 如果返回值为 1，表示 token 已更新
        // 重新调用 handleSubmit 方法
        await _handleSubmit();
    }else if (ret === 2 || ret === -1) {
        // 如果不成功，退出
        return;
    }

    clearDataGroup(); // 清除数据组
    window.location.href = "../form/thanks.html";
}


/* 送信按钮点击事件 */
async function _handleSubmit() {
    const formData = getDataGroup();
    try {
        const responseData = await sendFormDataToServer(formData);

        if (responseData.refreshToken) {
            console.log("Token已更新:", responseData.refreshToken);
            return 1;
        }
        if (responseData.fail) {
            showMessage(responseData.msg, "error");
            return 2;
        }        
        return 0;
    } catch (error) {
        showMessage(error.message || "送信に失敗しました。再試行してください。", "error");
        return -1;
    }
}

// 将方法挂载到全局对象，供 HTML 调用
window.handleSubmit = handleSubmit;
