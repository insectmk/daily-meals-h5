/**
 * 菜谱分类信息
 */
export interface RecipeCategory {
  id: number // 分类编号
  parentId?: number // 父分类编号
  name?: string // 分类名称
  picUrl?: string // 移动端分类图
  sort?: number // 分类排序
  status?: number // 开启状态
  memo?: string // 备注
  children?: RecipeCategory[] // 孩子分类
}
