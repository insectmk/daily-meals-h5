import type { LoginData, LoginRes, Member } from '@/api/member/type'
import request from '@/utils/request'

/**
 * 登录请求
 * @param data 登录信息
 */
export function login(data: LoginData) {
  return request.post<LoginRes | null>('/member/auth/login', data)
}

/**
 * 获取用户信息
 */
export function getInfo() {
  return request.get<Member | null>('/member/user/get')
}
