import type { UserCollect } from '@/api/user-collect/type'
import request from '@/utils/request'
import type { PageParam, PageResult } from '@/api/type'

/**
 * 创建或更新用户收藏夹，通过id判断
 * @param param 用户收藏夹
 * @return 新增编号
 */
export function createUserCollect(param: UserCollect) {
  return request.post<number>('/meals/user-collect/create-or-update', param)
}

/**
 * 分页查询自己的收藏夹信息
 * @param pageReqVO
 */
export function getSelfUserCollectPage(pageReqVO: PageParam) {
  return request.get<PageResult<UserCollect>>('/meals/user-collect/page-self', pageReqVO)
}

/**
 * 查询用户收藏夹信息
 * @param id 收藏夹ID
 */
export function getUserCollect(id: number) {
  return request.get<UserCollect>('/meals/user-collect/get', { id })
}
