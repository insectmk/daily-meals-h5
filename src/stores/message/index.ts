import { defineStore } from 'pinia'
import type { ChatUnreadMessageCnt } from '@/api/user-chat/type'
import type { MessageInfo } from '@/stores/message/type'

export const useMessageStore = defineStore('message', () => {
  const messageInfo = ref<MessageInfo>({
    chatUnread: [], // 聊天未读消息数
  })

  /** 设置聊天未读消息信息 */
  const setChatUnreadMsgInfo = (chatUnreadMsgCnt: ChatUnreadMessageCnt[]) => {
    messageInfo.value.chatUnread = chatUnreadMsgCnt
  }
  /** 获取所有未读消息数量 */
  function getChatUnreadMsgCount(): number {
    return messageInfo.value.chatUnread.reduce((msgCnt, chatItem) => msgCnt + chatItem.unreadCount, 0)
  }
  /** 获取会话未读消息数量 */
  function getChatUnreadMsgCountById(conversationId: number): number {
    return messageInfo.value.chatUnread.find(chatUnreadMsgCnt => chatUnreadMsgCnt.conversationId === conversationId)?.unreadCount || 0
  }
  /** 设置某个会话已读 */
  function setChatConversationReadById(conversationId: number) {
    const conversationUnread = messageInfo.value.chatUnread.find(chatUnreadMsgCnt => chatUnreadMsgCnt.conversationId === conversationId)
    if (conversationUnread) {
      conversationUnread.unreadCount = 0
    }
  }

  return {
    messageInfo,
    setChatUnreadMsgInfo,
    getChatUnreadMsgCount,
    getChatUnreadMsgCountById,
    setChatConversationReadById,
  }
}, {
  persist: true,
})

export default useMessageStore
