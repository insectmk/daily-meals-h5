import request from '@/utils/request'
import type { ChatMessageSendReq } from '@/api/user-chat/type'

/**
 * 发送消息
 * @param param 消息内容
 */
export function sendUserChatMessage(param: ChatMessageSendReq) {
  return request.post<number>('/meals/user-chat-message/send', param)
}
