import { ElMessage } from 'element-plus';

/**
 * 通用表单校验方法
 * @param formRef 表单的 ref 引用
 * @returns {Promise<boolean>} 校验是否通过
 */
export const validateForm = async (formRef: any): Promise<boolean> => {
  try {
    await formRef.validate();
    return true;
  } catch (e) {
    ElMessage.error("フォームの検証に失敗しました");
    return false;
  }
};