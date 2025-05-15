import type { Member } from '@/api/member/type'
import request from '@/utils/request'

/**
 * 获取用户信息
 */
export function getInfo() {
  return request.get<Member | null>('/member/user/get')
}
