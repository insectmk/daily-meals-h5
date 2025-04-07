import dayjs from 'dayjs'

/**
 * 日期格式化
 * @param date 日期
 * @param format 格式化字符串
 */
export function formatDate(date: Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs(date).format(format)
}
