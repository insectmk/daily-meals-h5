import { defineStore } from 'pinia'
import type { LoginData, SmsLoginReq } from '@/api/auth/type'
import type {
  Member,
  MemberUserUpdateMobileReq,
  MemberUserUpdatePasswordReq,
  MemberUserUpdateReq,
} from '@/api/member/type'
import { clearAllToken, setRefreshToken, setToken } from '@/utils/auth'
import {
  getInfo as getMemberInfo,
  updateUser as updateMember,
  updateUserMobile,
  updateUserPassword,
} from '@/api/member'
import {
  login as memberLogin,
  smsLogin as memberSmsLogin,
} from '@/api/auth'
import ResponseCode from '@/constants/response-code'
import { loginOut } from '@/api/system'

// 会员初始化信息
const InitMemberInfo = {
  id: 0, // 用户ID
  avatar: 'http://localhost:62401/src/assets/imgs/logo.svg', // 头像
}

export const useMemberStore = defineStore('member', () => {
  const memberInfo = ref<Member>({ ...InitMemberInfo })

  // 设置用户信息
  const setMemberInfo = (partial: Partial<Member>) => {
    memberInfo.value = { ...partial }
  }
  // 会员登录
  const login = async (loginForm: LoginData) => {
    try {
      const result = await memberLogin(loginForm)
      // 判断是否登录成功
      if (result.code === ResponseCode.SUCCESS.code) {
        setToken(result.data?.accessToken) // 设置令牌
        setRefreshToken(result.data?.refreshToken) // 设置刷新令牌
      }
      return result
    }
    catch (error) {
      clearAllToken()
      throw error
    }
  }
  // 会员手机验证码登录
  const smsLogin = async (loginForm: SmsLoginReq) => {
    try {
      const result = await memberSmsLogin(loginForm)
      // 判断是否登录成功
      if (result.code === ResponseCode.SUCCESS.code) {
        setToken(result.data?.accessToken) // 设置令牌
        setRefreshToken(result.data?.refreshToken) // 设置刷新令牌
      }
      return result
    }
    catch (error) {
      clearAllToken()
      throw error
    }
  }
  // 获取会员信息
  const info = async () => {
    try {
      const { data: memberInfo } = await getMemberInfo()
      setMemberInfo(memberInfo)
    }
    catch (error) {
      clearAllToken()
      throw error
    }
  }
  // 更新用户基础信息
  const updateMemberCommonInfo = async (data: MemberUserUpdateReq) => {
    const result = await updateMember(data)
    // 判断是否修改成功
    if (result.code === ResponseCode.SUCCESS.code) {
      // 同步修改用户信息
      if (data.avatar)
        memberInfo.value.avatar = data.avatar
      if (data.sex)
        memberInfo.value.sex = data.sex
      if (data.nickname)
        memberInfo.value.nickname = data.nickname
    }
    return result
  }
  // 更新用户手机
  const updateMemberMobile = async (data: MemberUserUpdateMobileReq) => {
    const result = await updateUserMobile(data)
    // 判断是否修改成功
    if (result.code === ResponseCode.SUCCESS.code) {
      // 同步修改用户信息
      memberInfo.value.mobile = data.mobile
    }
    return result
  }
  // 修改用户密码
  const updateMemberPassword = async (data: MemberUserUpdatePasswordReq) => {
    const result = await updateUserPassword(data)
    // 判断是否修改成功
    if (result.code === ResponseCode.SUCCESS.code) {
      // 什么也不做
    }
    return result
  }
  // 退出登录
  const logout = async () => {
    try {
      return await loginOut()
    }
    finally {
      // 清除令牌
      clearAllToken()
      setMemberInfo({ ...InitMemberInfo })
    }
  }
  return {
    memberInfo,
    info,
    login,
    smsLogin,
    logout,
    updateMemberCommonInfo,
    updateMemberMobile,
    updateMemberPassword,
  }
}, {
  persist: true,
})

export default useMemberStore
