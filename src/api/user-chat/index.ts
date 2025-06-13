import request from '@/utils/request'
import type { ChatMessageInfo, ChatMessageSendReq, UserChatMessagePageParam } from '@/api/user-chat/type'

/**
 * 发送消息
 * @param param 消息内容
 */
export function sendUserChatMessage(param: ChatMessageSendReq) {
  return request.post<number>('/meals/user-chat-message/send', param)
}

/**
 * 获得用户聊天消息列表
 * @param pageParam 分页条件
 */
export function getUserChatMessageList(pageParam: UserChatMessagePageParam) {
  return request.get<ChatMessageInfo[]>('/meals/user-chat-message/list', pageParam)
}
