import request from '@/utils/request'
import type { DictInfo } from '@/api/common/type'

/**
 * 根据字典类型查询字典数据信息
 */
export function getDictDataListByType(type: string) {
  return request.get<DictInfo[]>('/meals/common/dict-data/type', { type })
}
