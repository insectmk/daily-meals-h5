/**
 * 解析URL的路径和查询参数
 * @param urlString 要解析的URL字符串
 * @returns 包含路径和查询参数的对象
 */
export function parseUrl(urlString: string): {
  path: string
  params: Record<string, string>
} {
  // 创建URL对象
  const url = new URL(urlString)

  // 提取路径
  const path = url.pathname

  // 提取查询参数
  const params: Record<string, string> = {}
  url.searchParams.forEach((value, key) => {
    params[key] = value
  })

  return { path, params }
}
