import type { UserFavorCancelParam, UserFavorCreatParam } from '@/api/user-favor/type'
import request from '@/utils/request'

/**
 * 添加用户收藏
 * @param param
 */
export function addUserFavor(param: UserFavorCreatParam) {
  return request.post<boolean>('/meals/user-favor/create', param)
}

/**
 * 取消用户收藏
 * @param params 取消参数
 */
export function cancelUserFavor(params: UserFavorCancelParam) {
  return request.del<boolean>('/meals/user-favor/cancel', params)
}
