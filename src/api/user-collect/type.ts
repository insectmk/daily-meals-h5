/**
 * 菜谱菜单
 */
export interface UserCollect {
  id?: number // 编号
  userId?: number // 用户编号
  contentType?: number // 内容类型
  collectName?: string // 收藏夹名称
  picUrl?: string // 封面图
  collectDesc?: string // 简介
  collectStatus?: number // 收藏夹状态
}
