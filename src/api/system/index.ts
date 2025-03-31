import request from '@/utils/request'

/**
 * 登出
 */
export function loginOut() {
  return request.post<boolean>('/member/auth/logout')
}
