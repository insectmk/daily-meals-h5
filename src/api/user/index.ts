import request from '@/utils/request'
import type { User, UserInteractData } from '@/api/user/type'
import type { PageParam, PageResult } from '@/api/type'

/**
 * 根据字典类型查询字典数据信息
 */
export function getUsersPage(pageParam: PageParam) {
  return request.get<PageResult<User>>('/meals/user/page', pageParam)
}

/**
 * 获取用户的关注数、粉丝数、获赞与收藏量
 */
export function getUserInteractData(userId: number) {
  return request.get<UserInteractData>('/meals/user/user-interact-data', { userId })
}
