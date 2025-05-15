import { defineStore } from 'pinia'
import type { LoginData } from '@/api/auth/type'
import type { Member } from '@/api/member/type'
import { clearAllToken, setRefreshToken, setToken } from '@/utils/auth'
import {
  getInfo as getMemberInfo,
} from '@/api/member'
import {
  login as memberLogin,
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
    logout,
  }
}, {
  persist: true,
})

export default useMemberStore
