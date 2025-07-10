/**
 * API缓存键值，用于存取
 */
class LocalCacheKey<T = unknown> {
  constructor(
    public readonly key: string, // 缓存key
    public readonly dateType?: T, // 缓存内容类型
  ) {}

  // ========== 计划详情页 ==========
  static readonly MEALS_PLAN_DETAIL_TAB = new LocalCacheKey<string>('MEALS_PLAN_DETAIL_TAB') // 计划详情页tab

  // 可选：添加toString方法便于调试
  toString(): string {
    return `key[code=${this.key},value=${this.dateType?.toString()}]`
  }
}

// 导出单例
export default LocalCacheKey
