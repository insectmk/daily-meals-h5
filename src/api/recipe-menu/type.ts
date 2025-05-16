import type { RecipeInfo } from '@/api/recipe/type'

/**
 * 菜谱菜单
 */
export interface RecipeMenu {
  id?: number // 编号
  title?: string // 标题
  subtitle?: string // 副标题
  menuDesc?: string // 菜单描述
  picUrl?: string // 菜单封面图
  menuType?: number // 菜单类型
  menuStatus?: number // 菜单状态
  memo?: string // 备注
  createTime?: number // 创建时间
  recipes?: RecipeInfo[] // 菜谱信息列表
  selfMenu: boolean // 是否为自己的菜单
}

/**
 * 菜谱菜单精简信息：用于下拉列表
 */
export interface SimpleRecipeMenuInfo {
  id: number // 编号
  title: string // 标题
}
