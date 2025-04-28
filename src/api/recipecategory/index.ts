import request from '@/utils/request'
import type { RecipeCategory } from '@/api/recipecategory/type'

/**
 * 获取菜谱分类列表信息
 */
export function getRecipeCategoryList() {
  return request.get<RecipeCategory[]>('/meals/recipe-category/list')
}
