import request from '@/utils/request'
import type { SimpleFoodInfo } from '@/api/food/type'

/**
 * 获取食材精简信息列表
 * @return 精简信息列表
 */
export function getSimpleFoodList() {
  return request.get<SimpleFoodInfo[]>('/meals/food/list-all-simple')
}
