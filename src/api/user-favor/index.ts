import type { UserFavorCancelParam, UserFavorCreatParam } from '@/api/user-favor/type'
import request from '@/utils/request'
import type { UserCollect } from '@/api/user-collect/type'

/**
 * 添加用户收藏
 * @param param
 */
export function addUserFavor(param: UserFavorCreatParam) {
  return request.post<boolean>('/meals/user-favor/create', param)
}
/**
 * 添加到默认收藏夹
 * @param param
 * @return 默认收藏夹信息
 */
export function addToDefaultCollect(param: UserFavorCreatParam) {
  return request.post<UserCollect>('/meals/user-favor/add-to-default', param)
}

/**
 * 取消用户收藏
 * @param params 取消参数
 */
export function cancelUserFavor(params: UserFavorCancelParam) {
  return request.del<boolean>('/meals/user-favor/cancel', params)
}
