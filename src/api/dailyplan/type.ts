/**
 * 菜谱加入到计划请求体
 */
export interface CreatePlanReq {
  /**
   * 菜谱ID集合
   */
  recipeIds: number[]
  /**
   * 餐次类型
   */
  mealType: number
  /**
   * 备注
   */
  memo: string
}
