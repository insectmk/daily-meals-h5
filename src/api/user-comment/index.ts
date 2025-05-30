import request from '@/utils/request'
import type { UserComment, UserCommentPageReq } from '@/api/user-comment/type'
import type { PageResult } from '@/api/type'

/**
 * 分页获取评论内容
 * @param pageReq 分页请求信息
 */
export function getCommentPage(pageReq: UserCommentPageReq) {
  return request.get<PageResult<UserComment>>('/meals/user-comment/page', pageReq)
}

/**
 * 创建评论
 * @param req 评论信息
 */
export function createComment(req: UserComment) {
  return request.post<number>('/meals/user-comment/create', req)
}
