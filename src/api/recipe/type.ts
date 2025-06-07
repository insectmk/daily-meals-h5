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
  id?: number
  userId?: number
  name?: string
  recipeDesc?: string
  recipeStep?: string
  recipeCategory?: number[] // 菜谱分类
  recipeType?: number
  recipeLevel?: number
  sort?: number
  memo?: string
  status?: number
  createTime?: number
  /**
   * 菜谱封面图
   */
  picUrl?: string
  /**
   * 菜谱轮播图
   */
  sliderPicUrls?: string[]
  foods?: RecipeFoodInfo[]
  selfRecipe?: boolean // 是否为自己的菜谱
  favor?: boolean // 是否收藏
  userNickname?: string // 用户名称
  userAvatar?: string // 用户头像
  userFavor?: boolean // 是否关注菜谱作者
}

/**
 * 菜谱食材
 */
export interface RecipeFoodInfo {
  id: number
  recipeId: number
  amount: number
  foodName: string
  foodUnit: string
  memo: string
}

/**
 * 最热门菜谱请求参数
 */
export interface GetPopularPublicParam {
  /**
   * 排名数量
   */
  rankLen: number
  /**
   * 餐次类型：数组
   */
  mealType: number[]
}
/**
 * 菜谱食材请求信息
 */
export interface RecipeFoodReq {
  foodId: number
  amount: number
  memo: string
}

/**
 * 菜谱评论信息
 */
export interface RecipeComment {
  id?: number // 编码
  userId?: number // 评论人编号
  userNickname?: string // 评价人名称
  userAvatar?: string // 评价人头像
  recipeId?: number // 内容编号
  commentContent?: string // 评论内容
  picUrls?: string[] // 评论图片地址数组
  replyUserId?: number // 回复的用户编号
  replyUserNickname?: string // 回复的用户名称
  replyContent?: string // 回复的内容
}
