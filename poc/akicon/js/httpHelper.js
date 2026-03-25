import { AKICON_TOKEN_KEY } from "./common.js"; // 引入 bindNextButtonClick
// POC: サンドボックス公開URLのmock-APIサーバーに接続
export const BASE_URL = "https://8080-i4w35db89dz6wdg6ow0yv-0e616f0a.sandbox.novita.ai/jikajimai";


export async function getAddressByPostalCode(postalCode) {
  const apiUrl = `https://jp-postal-code-api.ttskch.com/api/v1/${postalCode}.json`; // 拼接 API 地址

  try {
    const response = await fetch(apiUrl); // 等待 fetch 请求完成
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`); // 打印错误信息
      return [false, "API呼び出し失敗しました。"]; // 返回失败状态和错误信息
    }

    const data = await response.json(); // 等待 JSON 解析完成
    // 提取地址字段
    const address = data.addresses[0].ja; // 获取日文地址
    const fullAddress = `${address.prefecture}${address.address1}${address.address2}${address.address3}${address.address4}`;
    console.info("请求完成:", fullAddress); // 打印错误信息
    return [true, fullAddress]; // 返回成功状态和完整地址
  } catch (error) {
    console.error("请求失败:", error); // 打印错误信息
    return [false, "API呼び出し失敗しました。"]; // 返回失败状态和错误信息
  }
}

/* 使用 POST 提交数据到服务器的方法 */
export async function sendFormDataToServer(data) {
    const url = `${BASE_URL}/customerInquiry/akicon`; // 使用 BASE_URL 拼接完整 URL
    try {
        // 从 sessionStorage 获取 akiconToken
        const token = sessionStorage.getItem(AKICON_TOKEN_KEY);
        if (!token) {
            showMessage("認証トークンが見つかりません。再ログインしてください。", "error");
            return;
        }
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // 设置请求头为 JSON 格式
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data), // 将数据序列化为 JSON 字符串
        });

        // 检查响应头中是否包含 x-refreshed-token
        // 如果包含，则更新 sessionStorage 中的 akiconToken
        if(response.headers.get("x-refreshed-token")) {
            sessionStorage.setItem(AKICON_TOKEN_KEY, response.headers.get("x-refreshed-token")); // 更新 token
            return { "refreshToken": "XXXXXXXXXXXXXXXXXX" }; // 返回新的 token
        }

        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`); // 如果响应状态不是 2xx，抛出错误
        }

        return await response.json(); // 返回解析后的 JSON 数据
    } catch (error) {
        throw error; // 抛出错误以供调用方处理
    }
}

// 示例调用
// (async () => {
//   const postalCode = "1600005"; // 示例邮政编码
//   const [success, message] = await getAddressByPostalCode(postalCode); // 使用解构获取状态和信息
//   console.log("成功状态:", success); // 打印成功状态
//   console.log("信息:", message); // 打印地址或错误信息
// })();