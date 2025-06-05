import request from '@/utils/request'
import type { User } from '@/api/user/type'

/**
 * 根据字典类型查询字典数据信息
 */
export function getUserListByNickname(nickname: string) {
  return request.get<User[]>('/meals/user/users-by-nickname', { nickname })
}
