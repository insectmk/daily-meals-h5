/**
 * 发送用户聊天消息
 */
export interface ChatMessageSendReq {
  receiverUserId: number // 接收人编号
  contentType: number // 消息类型
  content: string // 消息
}
