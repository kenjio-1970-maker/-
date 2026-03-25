export default defineNuxtPlugin(() => {
  /**
   * 强制刷新标识符，生成唯一值
   * @returns string 格式为 {timestamp}_{random}
   */
  const forceReload = (): string => `${Date.now()}_${Math.random()}`;

  /**
   * 将日期转换为本地时间的 ISO 字符串（去掉 Z）
   * @param inputDate Date | string
   * @returns yyyy-MM-ddTHH:mm:ss 格式字符串
   */
  // const toLocalISOString = (inputDate: Date | string): string => {
  const toLocalISOString = (inputDate: Date): string => {
    // const date = new Date(inputDate);
    const date = inputDate;
    const offset = date.getTimezoneOffset();
    // const localDate = new Date(date.getTime() - offset * 60000);
    const localDate = new Date(date.getTime());
    return localDate.toISOString().slice(0, 19);
    // return localDate.toISOString();
  };

  return {
    provide: {
      forceReload,
      toLocalISOString, // 注入时间处理函数
    },
  };
});