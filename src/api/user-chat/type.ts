/**
 * 发送用户聊天消息
 */
export interface ChatMessageSendReq {
  receiverUserId: number // 接收人编号
  contentType: number // 消息类型
  content: string // 消息
}
/**
 * 用户聊天消息
 */
export interface ChatMessageInfo {
  id?: number // 编号
  conversationId?: number // 会话编号
  senderUserId?: number // 发送人编号
  senderUserAvatar?: string // 发送人头像
  receiverUserId?: number // 接收人编号
  contentType?: number // 消息类型
  content?: string // 消息
  readStatus?: boolean // 是否已读
  createTime?: number // 创建时间
}

/**
 * 用户聊天消息分页请求
 */
export interface UserChatMessagePageParam {
  conversationId?: number // 会话编号
  createTime: string // 发送时间，小于该发送时间 YYYY-MM-DD HH:mm:ss
  receiverUserId: number// 接收方用户编码
  limit: number// 每次查询条数，最大值为 100
}

/** 用户聊天会话 */
export interface UserChatConversationInfo {
  id: number // 编号
  userId: number // 会话所属用户
  chatUserId: number // 会话聊天对象用户
  chatUserAvatar: string // 会话聊天对象用户头像
  chatUserNickname: string // 会话聊天对象用户昵称
  lastMessageTime: number // 最后聊天时间
  lastMessageContent: string // 最后聊天内容
  lastMessageContentType: number // 最后发送的消息类型
  adminPinned: boolean // 管理端置顶
  userDeleted: boolean // 用户是否可见
  unreadMessageCount: number // 未读消息数
  createTime: number // 创建时间
}
/** 用户未读聊天消息 */
export interface ChatUnreadMessageCnt {
  conversationId: number // 会话编号
  unreadCount: number // 未读消息数
}
