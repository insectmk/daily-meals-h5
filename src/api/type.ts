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
