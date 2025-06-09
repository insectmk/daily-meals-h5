/**
 * 用户信息
 */
export interface User {
  id?: number // 用户ID
  avatar?: string // 头像
  brokerageEnabled?: boolean
  experience?: number // 过期时间
  level?: number // 等级
  mobile?: string // 手机号
  nickname?: string // 昵称
  point?: number
  sex?: number // 性别
  favor?: boolean // 是否关注
  createTime?: number // 创建时间
}

/**
 * 用户互动数据
 */
export interface UserInteractData {
  follows: number // 关注数
  fans: number // 粉丝数
  likes: number // 获赞
  collects: number // 收藏量
  recipes: number // 发布菜谱数
}
