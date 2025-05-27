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

/**
 * 手机 + 验证码登录
 */
export interface SmsLoginReq {
  // 手机号
  mobile: string
  // 验证码
  code: number
}

/**
 * SMS发送场景
 */
export enum SMS_SCENE_ENUM {
  MEMBER_LOGIN = 1, //  "user-sms-login", "会员用户 - 手机号登陆"),
  MEMBER_UPDATE_MOBILE = 2, //  "user-update-mobile", "会员用户 - 修改手机"),
  MEMBER_UPDATE_PASSWORD = 3, //  "user-update-password", "会员用户 - 修改密码"),
  MEMBER_RESET_PASSWORD = 4, //  "user-reset-password", "会员用户 - 忘记密码"),
}

/**
 * 发送手机验证码请求
 */
export interface SmsSendReq {
  // 手机号
  mobile: string
  // 发送场景
  scene: number
}
