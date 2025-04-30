import type { GetPopularPublicParam, GetRecipeParam, RecipeCreateReq, RecipeInfo } from '@/api/recipe/type'
import request from '@/utils/request'
import type { PageParam, PageResult } from '@/api/type'

/**
 * 分页查询可见的菜谱信息
 * @param pageReqVO
 */
export function getRecipePage(pageReqVO: PageParam) {
  return request.get<PageResult<RecipeInfo>>('/meals/recipe/page', pageReqVO)
}

/**
 * 分页查询自己的菜谱信息
 * @param pageReqVO
 */
export function getSelfRecipePage(pageReqVO: PageParam) {
  return request.get<PageResult<RecipeInfo>>('/meals/recipe/page/self', pageReqVO)
}

/**
 * 分页查询公共菜谱信息
 * @param pageReqVO
 */
export function getPublicRecipePage(pageReqVO: PageParam) {
  return request.get<PageResult<RecipeInfo>>('/meals/recipe/page/public', pageReqVO)
}

/**
 * 分页查询系统菜谱信息
 * @param pageReqVO
 */
export function getSystemRecipePage(pageReqVO: PageParam) {
  return request.get<PageResult<RecipeInfo>>('/meals/recipe/page/system', pageReqVO)
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

/**
 * 添加菜谱
 * @param param
 */
export function addRecipe(param: RecipeCreateReq) {
  return request.post<number>('/meals/recipe/create', param)
}
