import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { showNotify } from 'vant'
import { HEADER_ACCESS_TOKEN, HEADER_TENANT, STORAGE_TOKEN_KEY } from '@/stores/mutation-type'
import type { CommonResult } from '@/api/type'
import ResponseCode from '@/constants/response-code'
import { getRefreshToken, getToken, setRefreshToken, setToken } from '@/utils/auth'

// 请求队列
let requestList: any[] = []
// 是否正在刷新中
let isRefreshToken = false

// 这里是用于设定请求后端时，所用的 Token KEY
// 可以根据自己的需要修改，常见的如 Access-Token，Authorization
// 需要注意的是，请尽量保证使用中横线`-` 来作为分隔符，
// 避免被 nginx 等负载均衡器丢弃了自定义的请求头
export const REQUEST_TOKEN_KEY = 'Authorization'

// 创建 axios 实例
const baseURL = import.meta.env.VITE_APP_API_BASE_URL
const request = axios.create({
  // API 请求的默认前缀
  baseURL,
  timeout: 6000, // 请求超时时间
})

export type RequestError = AxiosError<{
  message?: string
  result?: any
  errorMessage?: string
}>

// 异常拦截处理器
function errorHandler(error: RequestError): Promise<any> {
  if (error.response) {
    const { data = {}, status, statusText } = error.response
    // 403 无权限
    if (status === 403) {
      showNotify({
        type: 'danger',
        message: (data && data.message) || statusText,
      })
    }
    // 401 未登录/未授权
    if (status === 401 && data.result && data.result.isLogin) {
      showNotify({
        type: 'danger',
        message: 'Authorization verification failed',
      })
      // 如果你需要直接跳转登录页面
      // location.replace(loginRoutePath)
    }
  }
  return Promise.reject(error)
}

// 请求拦截器
function requestHandler(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> {
  const savedToken = localStorage.getItem(STORAGE_TOKEN_KEY)
  // 如果 token 存在
  // 让每个请求携带自定义 token, 请根据实际情况修改
  if (savedToken)
    config.headers[HEADER_ACCESS_TOKEN] = savedToken
  // 租户ID
  config.headers[HEADER_TENANT] = import.meta.env.VITE_APP_TENANT_ID
  return config
}

// 添加请求拦截器
request.interceptors.request.use(requestHandler, errorHandler)

// 响应拦截器
async function responseHandler(response: AxiosResponse<any, any>) {
  // 判断是否未登录
  if (response.data.code === ResponseCode.UNAUTHORIZED.code) {
    // 提示消息
    showNotify({
      type: 'danger',
      message: ResponseCode.UNAUTHORIZED.message,
    })
    const refreshToken = getRefreshToken() // 刷新令牌
    // 如果未认证，并且未进行刷新令牌，说明可能是访问令牌过期了
    if (!isRefreshToken) { // 没有正在刷新
      isRefreshToken = true
      // 1. 如果获取不到刷新令牌，则只能执行登出操作
      if (!refreshToken) {
        // 跳转到登录页面
        return location.replace('login')
      }
      // 2. 进行刷新访问令牌
      try {
        const refreshTokenRes = await doRefreshToken()
        // 2.1 刷新成功，则回放队列的请求 + 当前请求
        setToken(refreshTokenRes.data.data.accessToken)
        setRefreshToken(refreshTokenRes.data.data.refreshToken)
        response.headers![HEADER_ACCESS_TOKEN] = `Bearer ${getToken()}`
        requestList.forEach((cb: any) => {
          cb()
        })
        requestList = []
        return request(response)
      }
      finally {
        requestList = []
        isRefreshToken = false
      }
    }
    else {
      // 添加到队列，等待刷新获取到新的令牌
      return new Promise((resolve) => {
        requestList.push(() => {
          response.headers![HEADER_ACCESS_TOKEN] = `Bearer ${getToken()}` // 让每个请求携带自定义token 请根据实际情况自行修改
          resolve(request(response))
        })
      })
    }
  }
  // 直接返回Data
  return response.data
}

// 添加响应拦截器
request.interceptors.response.use(responseHandler, errorHandler)

// *********工具方法***********
async function doRefreshToken() {
  axios.defaults.headers.common['tenant-id'] = import.meta.env.VITE_APP_TENANT_ID
  return await axios.post(`${baseURL}/member/auth/refresh-token?refreshToken=${getRefreshToken()}`)
}

// ********自定义封装请求方法********
/**
 * POST请求
 * @param url 请求路径
 * @param params 请求参数
 */
export function post<T>(url: string, params?: any) {
  return request.post<any, CommonResult<T>>(url, params)
}
/**
 * GET请求
 * @param url 请求路径
 * @param params 请求参数
 */
export function get<T>(url: string, params?: any) {
  return request.get<any, CommonResult<T>>(url, { params })
}

export default {
  post, // POST请求
  get, // GET请求
}
