import type { PageParam } from '@/api/type'

/**
 * 评论信息
 */
export interface UserComment {
  id: number // 编码
  userId: number // 评论人编号
  userNickname: string // 评价人名称
  userAvatar: string // 评价人头像
  contentId: number // 内容编号
  contentType: number // 内容类型
  commentContent: string // 评论内容
  commentAuthor: boolean // 是否内容作者
  picUrls: string // 评论图片地址数组
  replyUserId: number // 回复的用户编号
  replyUserNickname: string // 回复的用户名称
  replyContent: string // 回复的内容
  createTime: number // 创建时间
}

/**
 * 评论分页请求
 */
export interface UserCommentPageReq extends PageParam {
  contentId: number // 内容编号
  contentType: number // 内容类型
}
