import { STORAGE_TOKEN_KEY } from '@/stores/mutation-type'
import { useLocalStorage } from '@vueuse/core'

const token = useLocalStorage(STORAGE_TOKEN_KEY, '')
// 是否登录
function isLogin() {
  return !!token.value
}
// 获取令牌
function getToken() {
  return token.value
}
// 设置令牌
function setToken(newToken: string) {
  token.value = newToken
}
// 清除令牌
function clearToken() {
  token.value = null
}

export { isLogin, getToken, setToken, clearToken }
