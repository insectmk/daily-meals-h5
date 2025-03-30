class ResponseCode {
  constructor(
    public readonly code: number,
    public readonly message: string,
  ) {}

  // ========== 成功 ==========
  static readonly SUCCESS = new ResponseCode(0, '成功')

  // ========== 客户端错误段 ==========
  static readonly BAD_REQUEST = new ResponseCode(400, '请求参数不正确')
  static readonly UNAUTHORIZED = new ResponseCode(401, '账号未登录')
  static readonly FORBIDDEN = new ResponseCode(403, '没有该操作权限')
  static readonly NOT_FOUND = new ResponseCode(404, '请求未找到')
  static readonly METHOD_NOT_ALLOWED = new ResponseCode(405, '请求方法不正确')
  static readonly LOCKED = new ResponseCode(423, '请求失败，请稍后重试') // 并发请求，不允许
  static readonly TOO_MANY_REQUESTS = new ResponseCode(429, '请求过于频繁，请稍后重试')

  // ========== 服务端错误段 ==========
  static readonly INTERNAL_SERVER_ERROR = new ResponseCode(500, '系统异常')
  static readonly NOT_IMPLEMENTED = new ResponseCode(501, '功能未实现/未开启')
  static readonly ERROR_CONFIGURATION = new ResponseCode(502, '错误的配置项')

  // ========== 自定义错误段 ==========
  static readonly REPEATED_REQUESTS = new ResponseCode(900, '重复请求，请稍后重试')
  static readonly DEMO_DENY = new ResponseCode(901, '演示模式，禁止写操作')
  static readonly UNKNOWN = new ResponseCode(999, '未知错误')

  // 可选：添加toString方法便于调试
  toString(): string {
    return `ErrorCode[code=${this.code}, message=${this.message}]`
  }
}

// 导出单例
export default ResponseCode
