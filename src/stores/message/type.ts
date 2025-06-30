import type { ChatUnreadMessageCnt } from '@/api/user-chat/type'
import type { MsgInteractData } from '@/api/statistics/type'

/** 消息信息 */
export interface MessageInfo {
  chatUnread: ChatUnreadMessageCnt[] // 聊天会话未读消息数量
  msgInteractData: MsgInteractData // 消息统计数据
}
