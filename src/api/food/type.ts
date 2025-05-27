/**
 * 获取食材精简信息：用于下拉列表
 */
export interface SimpleFoodInfo {
  id: number
  name: string
}

/**
 * 食材信息
 */
export interface FoodInfo {
  /**
   * 编号
   */
  id: number
  /**
   * 名称
   */
  name: string
  /**
   * 分类
   */
  foodType: number
  /**
   * 单位
   */
  foodUnit: number
  /**
   * 备注
   */
  memo: string
  /**
   * 创建时间
   */
  createTime: number
}
