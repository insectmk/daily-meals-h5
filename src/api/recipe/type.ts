/**
 * ------------参数规范说明--------------
 * ReqVO XxxParams / XxxRequest前端更倾向于强调「参数」或「请求体」
 * RespVO XxxResponse / XxxDTO 前端可能区分原始响应和加工后的数据
 * DTO XxxDTO 前后端一致的字段结构
 */
/**
 * 获取菜谱信息的请求参数
 */
export interface GetRecipeParam {
  /**
   * 菜谱ID
   */
  id: number
}
/**
 * 菜谱信息
 */
export interface RecipeInfo {
  id: number
  userId: number
  name: string
  recipeDesc: string
  recipeStep: string
  recipeType: number
  recipeLevel: number
  sort: number
  memo: string
  status: number
  createTime: number
  /**
   * 菜谱封面图
   */
  picUrl: string
  /**
   * 菜谱轮播图
   */
  sliderPicUrls: string[]
  foods: RecipeFoodInfo[]
}

/**
 * 菜谱食材
 */
export interface RecipeFoodInfo {
  id: number
  recipeId: number
  foodId: number
  amount: number
  foodName: string
  foodUnit: number
  memo: string
}
