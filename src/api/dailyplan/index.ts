import type { CreatePlanReq, DailyPlanInfo, DailyPlanPageParam, GetDailyParam } from '@/api/dailyplan/type'
import request from '@/utils/request'
import type { PageResult } from '@/api/type'

/**
 * 将菜谱加入到计划
 * @param data 请求内容
 * @return 新增计划的id集合
 */
export function addRecipesPlan(data: CreatePlanReq) {
  return request.post<number[]>('/meals/daily-plan/create', data)
}

/**
 * 分页查询菜谱计划信息
 * @param pageReqVO
 */
export function page(pageReqVO: DailyPlanPageParam) {
  return request.get<PageResult<DailyPlanInfo>>('/meals/daily-plan/page', pageReqVO)
}

/**
 * 查询每日计划详细信息
 * @param param
 */
export function getDailyPlanInfo(param: GetDailyParam) {
  return request.get<DailyPlanInfo>('/meals/daily-plan/get', param)
}
