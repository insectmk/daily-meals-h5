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
/**
 * 会员用户更新 Request
 */
export interface MemberUserUpdateReq {
  nickname?: string // 用户昵称
  avatar?: string // 头像
  sex?: number // 性别
}

/**
 * 修改手机请求
 */
export interface MemberUserUpdateMobileReq {
  // 新手机验证码
  code: string
  // 新手机号
  mobile: string
  // 原手机验证码
  oldCode?: string
}
/**
 * 修改密码 Req
 */
export interface MemberUserUpdatePasswordReq {
  // 新密码
  password: string
  // 手机验证码
  code: string
}

/**
 * 重置密码 Req
 */
export interface MemberUserResetPasswordReq {
  // 密码
  password: string
  // 手机验证码
  code: string
  // 手机号
  mobile: string
}
