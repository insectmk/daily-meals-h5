/**
 * 菜谱菜单
 */
export interface UserCollect {
  id?: number // 编号
  contentType?: number // 内容类型
  collectName?: string // 收藏夹名称
  picUrl?: string // 封面图
  collectDesc?: string // 简介
  collectStatus?: number // 收藏夹状态
  defaultFlag?: boolean // 是否默认收藏夹
}

/**
 * 菜谱菜单
 */
export interface SimpleUserCollect {
  id?: number // 编号
  collectName?: string // 收藏夹名称
  collectDesc?: string // 简介
  collectStatus?: number // 收藏夹状态
  selected?: boolean // 内容是否在该收藏夹中
}
/**
 * 用户获取精简收藏列表请求
 */
export interface UserCollectSimpleListReq {
  contentType: number // 内容类型
  contentId: number // 内容编号
}
