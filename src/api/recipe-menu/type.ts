/**
 * 菜谱菜单
 */
export interface RecipeMenu {
  // 编号
  id: number
  // 标题
  title: string
  // 副标题
  subtitle: string
  // 菜单描述
  menuDesc: string
  // 菜单封面图
  picUrl: string
  // 备注
  memo: string
  // 创建时间
  createTime: number
}

/**
 * 菜谱菜单精简信息：用于下拉列表
 */
export interface SimpleRecipeMenuInfo {
  id: number // 编号
  title: string // 标题
}
