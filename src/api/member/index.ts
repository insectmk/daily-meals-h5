import type { Member, MemberUserUpdateReq } from '@/api/member/type'
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
