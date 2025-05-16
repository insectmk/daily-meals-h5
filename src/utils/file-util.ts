/**
 * 友好转换字节大小
 * @param bytes
 */
export function bytesToSize(bytes: number) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0)
    return '0 B'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(2)} ${units[i]}`
}

/**
 * 获取文件名称
 * @param url 文件url
 */
export function getFileName(url: string): string {
  try {
    // 解码 URL 编码字符（如空格 %20 → " "）
    const decodedUrl = decodeURIComponent(url)
    // 清理参数并分割路径
    const cleanUrl = decodedUrl.replace(/[?#].*$/, '')
    const fileName = cleanUrl.split('/').pop() || 'unknown'
    // 去除首尾非打印字符
    return fileName.trim().replace(/^[\s.]+|[\s.]+$/g, '')
  }
  catch (error) {
    console.error('URL解析失败:', error)
    return 'invalid_filename'
  }
}
