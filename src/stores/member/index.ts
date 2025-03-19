import { defineStore } from 'pinia'
import type { LoginData, Member } from '@/api/member/type'
import { clearToken, setToken } from '@/utils/auth'
import {
  login as memberLogin,
} from '@/api/member'

// 会员初始化信息
const InitMemberInfo = {
  userId: 0,
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
      setToken(result.data?.accessToken)
    }
    catch (error) {
      clearToken()
      throw error
    }
  }
  // 获取会员信息
  const info = async () => {
    try {
      setMemberInfo(InitMemberInfo)
    }
    catch (error) {
      clearToken()
      throw error
    }
  }
  // 退出登录
  const logout = async () => {
    try {
      console.warn('退出登录')
    }
    finally {
      clearToken()
      setMemberInfo({ ...InitMemberInfo })
    }
  }
  return {
    memberInfo,
    info,
    login,
    logout,
    memberLogin,
  }
}, {
  persist: true,
})

export default useMemberStore
