import request from '@/utils/request'

/**
 * 登出
 */
export function loginOut() {
  return request.postAdmin<boolean>('/system/auth/logout')
}
