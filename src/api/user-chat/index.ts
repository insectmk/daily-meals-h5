import request from '@/utils/request'
import type {
  ChatMessageInfo,
  ChatMessageSendReq,
  ChatUnreadMessageCnt,
  UserChatConversationInfo,
  UserChatMessagePageParam,
} from '@/api/user-chat/type'

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

/**
 * 获得用户未读消息数信息
 */
export function getUserChatUnreadMessageCountList() {
  return request.get<ChatUnreadMessageCnt[]>('/meals/user-chat-message/unread-count-list')
}

// *********会话***********

/**
 * 获得用户会话列表
 */
export function getConversationList() {
  return request.get<UserChatConversationInfo[]>('/meals/user-chat-conversation/list')
}
