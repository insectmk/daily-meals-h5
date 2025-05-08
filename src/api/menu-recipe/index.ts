import request from '@/utils/request'
import type { MenuRecipe } from '@/api/menu-recipe/type'

/**
 * 添加菜单菜谱
 * @param param 菜单菜谱信息
 */
export function addMenuRecipe(param: MenuRecipe) {
  return request.post<number>('/meals/menu-recipe/create', param)
}
