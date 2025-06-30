import request from '@/utils/request'
import type { MsgInteractData } from '@/api/statistics/type'

/**
 * 消息统计数据
 */
export function getMsgInteractData() {
  return request.get<MsgInteractData>('/meals/statistics/message/interact-data')
}
