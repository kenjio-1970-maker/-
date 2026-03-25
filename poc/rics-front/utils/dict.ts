interface DictOption {
  label: string;
  value: string | number;
}

// 字典选项缓存
const dictOptionsCache: Record<string, DictOption[]> = {
  'example': [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
  ]
};

/**
 * 获取字典选项
 * @param key 字典key
 * @returns 字典选项数组
 */
export function getDictOptions(key: string): DictOption[] {
  return dictOptionsCache[key] || [];
}

/**
 * 获取树形字典选项
 * @param key 字典key
 * @returns 字典选项数组
 */
export function getTreeData(selectKey) {
    let dictData = JSON.parse(localStorage.getItem("dictData")) || {};
    return dictData[selectKey] || [];
  }
  