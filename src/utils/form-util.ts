/**
 * 通用对象转 FormData（支持嵌套对象和数组）
 * @param object 要转换的对象
 */
export function getFormData(object: Record<string, any>): FormData {
  const formData = new FormData()
  Object.keys(object).forEach((key) => {
    const value = object[key]
    if (value instanceof File) {
      formData.append(key, value, value.name) // 文件类型特殊处理
    }
    else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, item) // 数组处理[5](@ref)
      })
    }
    else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value)) // 嵌套对象序列化
    }
    else {
      formData.append(key, value) // 普通字段
    }
  })
  return formData
}
