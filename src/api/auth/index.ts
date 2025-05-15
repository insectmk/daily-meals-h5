import type { LoginData, LoginRes, SmsLoginReq, SmsSendReq } from '@/api/auth/type'
import request from '@/utils/request'

/**
 * 登录请求
 * @param data 登录信息
 */
export function login(data: LoginData) {
  return request.post<LoginRes>('/member/auth/login', data)
}

/**
 * 使用手机 + 验证码登录
 * @param data 请求参数
 */
export function smsLogin(data: SmsLoginReq) {
  return request.post<LoginRes>('/member/auth/sms-login', data)
}

/**
 * 发送手机验证码
 * @param data 请求参数
 */
export function sendSmsCode(data: SmsSendReq) {
  return request.post<boolean>('/member/auth/send-sms-code', data)
}
