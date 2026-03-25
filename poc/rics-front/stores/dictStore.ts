// store/dictStore.js
export default {
    dictData: process.client ? JSON.parse(window.localStorage.getItem("dictData") || '{}') : {},
  
    // 获取字典数据
    getDict(key) {
      return this.dictData[key] || [];
    },
  
    // 存储字典数据
    setDict(key, data) {
      this.dictData[key] = data;
      if (process.client) {
        window.localStorage.setItem("dictData", JSON.stringify(this.dictData));  // 本地存储
      }
    },
  
    // 一次性存入所有字典
    setAllDict(allData) {
      this.dictData = allData;
      if (process.client) {
        window.localStorage.setItem("dictData", JSON.stringify(this.dictData));
      }
    },
  
    // 清空缓存（用户退出时调用）
    clearDict() {
      this.dictData = {};
      if (process.client) {
        window.localStorage.removeItem("dictData");
      }
    }
  };
  