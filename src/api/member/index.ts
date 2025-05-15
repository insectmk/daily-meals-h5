import type {
  Member,
  MemberUserUpdateMobileReq,
  MemberUserUpdatePasswordReq,
  MemberUserUpdateReq,
} from '@/api/member/type'
import request from '@/utils/request'

/**
 * 获取用户信息
 */
export function getInfo() {
  return request.get<Member | null>('/member/user/get')
}

/**
 * 修改用户基本信息
 */
export function updateUser(data: MemberUserUpdateReq) {
  return request.put<boolean>('/member/user/update', data)
}

/**
 * 修改用户手机
 */
export function updateUserMobile(data: MemberUserUpdateMobileReq) {
  return request.put<boolean>('/member/user/update-mobile', data)
}

/**
 * 修改用户密码
 */
export function updateUserPassword(data: MemberUserUpdatePasswordReq) {
  return request.put<boolean>('/member/user/update-password', data)
}
