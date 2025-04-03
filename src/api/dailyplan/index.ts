import type { CreatePlanReq } from '@/api/dailyplan/type'
import request from '@/utils/request'

/**
 * 将菜谱加入到今日计划
 * @param data 请求内容
 * @return 新增计划的id集合
 */
export function addRecipesTodayPlan(data: CreatePlanReq) {
  return request.post<number[]>('/meals/daily-plan/create/today', data)
}
