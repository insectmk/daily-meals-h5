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
