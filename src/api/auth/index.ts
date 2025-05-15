import type { LoginData, LoginRes } from '@/api/auth/type'
import request from '@/utils/request'

/**
 * 登录请求
 * @param data 登录信息
 */
export function login(data: LoginData) {
  return request.post<LoginRes | null>('/member/auth/login', data)
}
