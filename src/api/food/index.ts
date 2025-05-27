import request from '@/utils/request'
import type { FoodInfo, SimpleFoodInfo } from '@/api/food/type'

/**
 * 获取食材精简信息列表
 * @return 精简信息列表
 */
export function getSimpleFoodList() {
  return request.get<SimpleFoodInfo[]>('/meals/food/list-all-simple')
}

/**
 * 获得食材
 * @return 获得食材
 */
export function getFood(params: { id: number }) {
  return request.get<FoodInfo>('/meals/food/get', params)
}
