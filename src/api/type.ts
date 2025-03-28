/**
 * 通用返回对象
 */
export interface CommonResult<T> {
  /**
   * 错误码
   */
  code: number
  /**
   * 返回数据
   */
  data: T
  /**
   * 错误提示，用户可阅读
   */
  msg: string
}

/**
 * 分页结果
 */
export interface PageResult<T> {
  /**
   * 数据
   */
  list: T[]
  /**
   * 总量
   */
  total: number
}

/**
 * 分页参数
 */
export interface PageParam {
  /**
   * 页码 从1开始
   */
  pageNo: number
  /**
   * 每页条数
   */
  pageSize: number
}
