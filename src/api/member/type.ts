/**
 * 登录信息
 */
export interface LoginData {
  mobile: string
  password: string
}

/**
 * 登录结果
 */
export interface LoginRes {
  accessToken: string // 令牌
  expiresTime: number // 过期时间
  openid: number
  refreshToken: string
  userId: number // 用户ID
}

/**
 * 会员信息
 */
export interface Member {
  id?: number // 用户ID
  avatar?: string // 头像
  brokerageEnabled?: boolean
  experience?: number // 过期时间
  level?: number // 等级
  mobile?: string // 手机号
  nickname?: string // 昵称
  point?: number
  sex?: number // 性别
}
