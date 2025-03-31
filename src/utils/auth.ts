import { STORAGE_REFRESH_TOKEN_KEY, STORAGE_TOKEN_KEY } from '@/stores/mutation-type'
import { useLocalStorage } from '@vueuse/core'

const token = useLocalStorage(STORAGE_TOKEN_KEY, '') // 登录令牌
const refreshToken = useLocalStorage(STORAGE_REFRESH_TOKEN_KEY, '') // 刷新令牌
// 是否登录
function isLogin() {
  return !!token.value
}
// 获取令牌
function getToken() {
  return token.value
}
// 获取刷新令牌
function getRefreshToken() {
  return refreshToken.value
}
// 设置令牌
function setToken(newToken: string) {
  token.value = newToken
}
// 设置刷新令牌
function setRefreshToken(newRefreshToken: string) {
  refreshToken.value = newRefreshToken
}
// 清除令牌
function clearToken() {
  token.value = null
}

export { isLogin, getToken, setToken, clearToken, getRefreshToken, setRefreshToken }
