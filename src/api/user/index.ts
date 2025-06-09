import request from '@/utils/request'
import type { User, UserInteractData } from '@/api/user/type'
import type { PageParam, PageResult } from '@/api/type'

/**
 * 分页查询用户
 */
export function getUsersPage(pageParam: PageParam) {
  return request.get<PageResult<User>>('/meals/user/page', pageParam)
}

/**
 * 分页查询关注用户
 */
export function getFollowUsersPage(pageParam: PageParam) {
  return request.get<PageResult<User>>('/meals/user/page-follows', pageParam)
}

/**
 * 分页查询粉丝用户
 */
export function getFanUsersPage(pageParam: PageParam) {
  return request.get<PageResult<User>>('/meals/user/page-fans', pageParam)
}

/**
 * 获取用户的关注数、粉丝数、获赞与收藏量
 */
export function getUserInteractData(userId: number) {
  return request.get<UserInteractData>('/meals/user/user-interact-data', { userId })
}

/**
 * 获取用户信息
 */
export function getUserInfo(id: number) {
  return request.get<User>('/meals/user/get', { id })
}
