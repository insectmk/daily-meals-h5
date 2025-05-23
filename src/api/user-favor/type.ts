/**
 * 用户收藏
 */
export interface FavorCreat {
  id?: number // 编号
  contentId?: number // 内容编号
  contentType?: number // 内容类型
  collectId?: number // 收藏夹
}

/**
 * 添加用户收藏参数
 */
export interface UserFavorCreatParam {
  contentId: number // 内容编号
  contentType: number // 内容类型
  collectIds?: number[] // 收藏夹
}

/**
 * 取消用户收藏参数
 */
export interface UserFavorCancelParam {
  contentId: number // 内容编号
  contentType: number // 内容类型
}
