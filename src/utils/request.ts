import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { showNotify } from 'vant'
import { HEADER_ACCESS_TOKEN, HEADER_TENANT, STORAGE_TOKEN_KEY } from '@/stores/mutation-type'
import type { CommonResult } from '@/api/type'
import ResponseCode from '@/constants/response-code'
import { getRefreshToken, setRefreshToken, setToken } from '@/utils/auth'
import qs from 'qs'
import router from '@/router'
import { parseUrl } from '@/utils/url-util'

interface RetryRequest {
  resolve: (value: unknown) => void
  config: InternalAxiosRequestConfig
}

// 请求队列
let retryRequests: RetryRequest[] = []
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
  withCredentials: false, // 禁用 Cookie 等信息
  // 自定义参数序列化函数
  paramsSerializer: (params) => {
    return qs.stringify(params, { allowDots: true })
  },
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
async function responseHandler(response: AxiosResponse) {
  const res = response.data
  // 如果是未登录401
  if (res.code === ResponseCode.UNAUTHORIZED.code) {
    const originalRequest = response.config
    // 是否正在刷新令牌
    if (!isRefreshToken) {
      isRefreshToken = true // 正在刷新令牌切换
      const refreshToken = getRefreshToken() // 获取刷新令牌
      // 没有刷新令牌，重新登录
      if (!refreshToken) {
        const urlInfo = parseUrl(window.location.href)
        router.push({
          name: 'login',
          query: {
            redirect: urlInfo.path,
            ...urlInfo.params,
          },
        })
        return Promise.reject(new Error('No refresh token'))
      }
      // 有刷新令牌
      try {
        // 刷新令牌
        const { data } = await request.post(`/member/auth/refresh-token?refreshToken=${refreshToken}`)
        // 设置刷新令牌与认证令牌
        setToken(data.accessToken)
        setRefreshToken(data.refreshToken)
        // 重试队列中的请求
        retryRequests.forEach(({ config, resolve }) => {
          resolve(request(config))
        })
        // 重试原始请求
        return request(originalRequest)
      }
      catch (error) {
        // 刷新失败清除 token 并跳转登录
        setToken('')
        setRefreshToken('')
        location.replace('/login')
        return Promise.reject(error)
      }
      finally {
        // 切换是否正在刷新令牌状态
        isRefreshToken = false
        // 清空请求队列
        retryRequests = []
      }
    }
    else {
      // 返回未完成 Promise 并缓存请求
      return new Promise((resolve) => {
        retryRequests.push({ resolve, config: originalRequest })
      })
    }
  }

  if (res.code !== ResponseCode.SUCCESS.code) {
    showNotify({ type: 'danger', message: res.msg || '请求异常' })
    return Promise.reject(new Error(res.msg || 'Error'))
  }

  return res
}

// 添加响应拦截器
request.interceptors.response.use(responseHandler, errorHandler)

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
/**
 * FormData请求（支持文件上传）
 * @param url 请求路径
 * @param formData 表单数据对象
 */
export function postForm<T>(url: string, formData: FormData) {
  return request.post<any, CommonResult<T>>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // 显式指定表单类型[3,7](@ref)
    },
  })
}
/**
 * PUT请求
 * @param url 请求路径
 * @param params 请求参数
 */
export function put<T>(url: string, params?: any) {
  return request.put<any, CommonResult<T>>(url, params)
}
/**
 * DELETE请求
 * @param url 请求路径
 * @param params 请求参数
 */
export function del<T>(url: string, params?: any) {
  return request.delete<any, CommonResult<T>>(url, { params })
}

export default {
  post, // POST请求
  get, // GET请求
  postForm, // POST-Form请求
  put, // PUT请求
  del, // DELETE请求
}
