import { defineStore } from 'pinia'
import type { LoginData, Member } from '@/api/member/type'
import { clearToken, setToken } from '@/utils/auth'
import {
  getInfo as getMemberInfo,
  login as memberLogin,
} from '@/api/member'

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
      const { data: memberInfo } = await getMemberInfo()
      setMemberInfo(memberInfo)
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
