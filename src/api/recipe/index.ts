import type { GetPopularPublicParam, GetRecipeParam, RecipeInfo } from '@/api/recipe/type'
import request from '@/utils/request'
import type { PageParam, PageResult } from '@/api/type'

/**
 * 分页查询菜谱信息
 * @param pageReqVO
 */
export function page(pageReqVO: PageParam) {
  return request.get<PageResult<RecipeInfo>>('/meals/recipe/page', pageReqVO)
}

/**
 * 分页查询公共菜谱信息
 * @param pageReqVO
 */
export function publicRecipePage(pageReqVO: PageParam) {
  return request.get<PageResult<RecipeInfo>>('/meals/recipe/page/public', pageReqVO)
}

/**
 * 查询菜谱详细信息
 * @param param
 */
export function getRecipeInfo(param: GetRecipeParam) {
  return request.get<RecipeInfo>('/meals/recipe/get', param)
}

/**
 * 获得最热门的公共菜谱
 * @param param
 */
export function getPopularPublicRecipes(param: GetPopularPublicParam) {
  return request.get<RecipeInfo[]>('/meals/recipe/public/popular', param)
}
