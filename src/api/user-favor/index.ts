import type { UserFavor } from '@/api/user-favor/type'
import request from '@/utils/request'

/**
 * 添加用户收藏
 * @param param
 */
export function addUserFavor(param: UserFavor) {
  return request.post<number>('/meals/user-favor/create', param)
}

/**
 * 删除用户收藏
 * @param id 收藏记录ID
 */
export function deleteUserFavor(id: number) {
  return request.del<boolean>('/meals/user-favor/delete', { id })
}
