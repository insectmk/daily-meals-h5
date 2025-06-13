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
