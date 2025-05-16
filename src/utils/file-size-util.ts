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
