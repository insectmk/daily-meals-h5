import type { RecipeMenu, SimpleRecipeMenuInfo } from '@/api/recipe-menu/type'
import request from '@/utils/request'
import type { PageParam, PageResult } from '@/api/type'

/**
 * 分页查询可见的菜谱菜单信息
 * @param pageReqVO
 */
export function getRecipeMenuPage(pageReqVO: PageParam) {
  return request.get<PageResult<RecipeMenu>>('/meals/recipe-menu/page', pageReqVO)
}

/**
 * 分页查询用户公开的菜谱菜单信息
 * @param pageReqVO
 */
export function getRecipeMenuPageByUser(pageReqVO: PageParam) {
  return request.get<PageResult<RecipeMenu>>('/meals/recipe-menu/page-by-user', pageReqVO)
}

/**
 * 分页查询自己的的菜谱菜单信息
 * @param pageReqVO
 */
export function getSelfRecipeMenuPage(pageReqVO: PageParam) {
  return request.get<PageResult<RecipeMenu>>('/meals/recipe-menu/page-self', pageReqVO)
}
/**
 * 分页查询可见的菜谱菜单信息
 * @param id
 */
export function getRecipeMenu(id: number) {
  return request.get<RecipeMenu>('/meals/recipe-menu/get', {
    id,
  })
}
/**
 * 获取自己的菜单精简信息列表
 */
export function getSelfRecipeMenuList() {
  return request.get<SimpleRecipeMenuInfo[]>('/meals/recipe-menu/list-self-simple')
}

/**
 * 创建菜谱菜单
 * @deprecated 使用创建/更新一体方法 createOrUpdateRecipeMenu
 */
export function createRecipeMenu(param: RecipeMenu) {
  return request.post<number>('/meals/recipe-menu/create', param)
}

/**
 * 添加/修改菜谱，根据id判断
 * @param param
 */
export function createOrUpdateRecipeMenu(param: RecipeMenu) {
  return request.post<number>('/meals/recipe-menu/create-or-update', param)
}

/**
 * 删除菜谱菜单
 * @param id 菜谱菜单ID
 */
export function deleteRecipeMenu(id: number) {
  return request.del<boolean>('/meals/recipe-menu/delete', { id })
}
