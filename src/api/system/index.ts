import request from '@/utils/request'
import type { DictInfo } from '@/api/system/type'

/**
 * 登出
 */
export function loginOut() {
  return request.post<boolean>('/member/auth/logout')
}

/**
 * 根据字典类型查询字典数据信息
 */
export function getDictDataListByType(type: string) {
  return request.get<DictInfo[]>('/system/dict-data/type', { type })
}
