import type { RecipeInfo } from '@/api/recipe/type'
import type { PageParam } from '@/api/type'

/**
 * 计划分页查询
 */
export interface DailyPlanPageParam extends PageParam {
  /**
   * 日期范围，'2025-04-17 00:00:00','2025-05-21 23:59:59',
   */
  planDate?: string[]
}

/**
 * 获取菜谱计划详细信息请求参数
 */
export interface GetDailyParam {
  id: number
}

/**
 * 菜谱加入到计划请求体
 */
export interface CreatePlanReq {
  /**
   * 菜谱ID集合
   */
  recipeIds: number[]
  /**
   * 计划时间，毫秒时间戳
   */
  planDate: number
  /**
   * 餐次类型
   */
  mealType: number
  /**
   * 备注
   */
  memo: string
}

/**
 * 菜谱计划信息
 */
export interface DailyPlanInfo {
  id: number
  recipeId: number
  userId: number
  planDate: number
  memo: string
  createTime: number
  items: DailyPlanItemInfo[]
}

/**
 * 菜谱计划明细信息
 */
export interface DailyPlanItemInfo {
  /**
   * 编号
   */
  id: number
  /**
   * 计划ID
   */
  planId: number
  /**
   * 菜谱ID
   */
  recipeId: number
  /**
   * 餐次类型
   */
  mealType: number
  /**
   * 备注
   */
  memo: string
  /**
   * 创建时间
   */
  createTime: number
  /**
   * 菜谱名称
   */
  recipeName: string
  /**
   * 菜谱详细信息
   */
  recipeInfo: RecipeInfo
}
