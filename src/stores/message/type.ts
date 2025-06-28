import type { ChatUnreadMessageCnt } from '@/api/user-chat/type'

/** 消息信息 */
export interface MessageInfo {
  chatUnread: ChatUnreadMessageCnt[] // 聊天会话未读消息数量
}
