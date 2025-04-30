import request from '@/utils/request'
import type { FoodCategory } from '@/api/foodcategory/type'

/**
 * 获取食材分类列表信息
 */
export function getFoodCategoryList() {
  return request.get<FoodCategory[]>('/meals/food-category/list')
}
