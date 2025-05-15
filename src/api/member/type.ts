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
