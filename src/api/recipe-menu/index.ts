import type { RecipeMenu } from '@/api/recipe-menu/type'
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
 * 分页查询可见的菜谱菜单信息
 * @param id
 */
export function getRecipeMenu(id: number) {
  return request.get<RecipeMenu>('/meals/recipe-menu/get', {
    id,
  })
}
