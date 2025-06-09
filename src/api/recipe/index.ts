import type { GetPopularPublicParam, GetRecipeParam, RecipeComment, RecipeInfo } from '@/api/recipe/type'
import request from '@/utils/request'
import type { PageParam, PageResult } from '@/api/type'

/**
 * 分页查询用户公开的菜谱信息
 * @param pageReqVO
 */
export function getRecipePageByUser(pageReqVO: PageParam) {
  return request.get<PageResult<RecipeInfo>>('/meals/recipe/page-by-user', pageReqVO)
}

/**
 * 获取用户关注作者的的菜谱分页
 * @param pageReqVO
 */
export function getFavorUsersRecipePage(pageReqVO: PageParam) {
  return request.get<PageResult<RecipeInfo>>('/meals/recipe/page-favor-users', pageReqVO)
}

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
 * @deprecated 不使用此方法添加菜谱了，使用新增/修改 createOrUpdateRecipe 统一接口
 */
export function addRecipe(param: RecipeInfo) {
  return request.post<number>('/meals/recipe/create', param)
}

/**
 * 添加/修改菜谱，根据id判断
 * @param param
 */
export function createOrUpdateRecipe(param: RecipeInfo) {
  return request.post<number>('/meals/recipe/create-or-update', param)
}

/**
 * 删除菜谱
 * @param id 菜谱ID
 */
export function deleteRecipe(id: number) {
  return request.del<boolean>('/meals/recipe/delete', { id })
}

/**
 * 评论菜谱
 * @param commentReq 评论内容
 */
export function createRecipeComment(commentReq: RecipeComment) {
  return request.post<boolean>('/meals/recipe/common', commentReq)
}
