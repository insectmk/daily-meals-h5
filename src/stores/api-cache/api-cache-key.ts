import { getRecipeCategoryList } from '@/api/recipecategory'
import type { CommonResult } from '@/api/type'

/**
 * API缓存键值，用于存取
 */
class APICacheKey {
  constructor(
    public readonly key: string, // 缓存key
    public readonly api: (...args: any[]) => Promise<CommonResult<any>>, // 需要缓存的api
    public readonly apiParams: any, // 缓存的api参数
  ) {}

  // ========== 菜谱菜单 ==========
  static readonly MEALS_RECIPE_CATEGORY = new APICacheKey('MEALS_RECIPE_CATEGORY', getRecipeCategoryList, null)

  // 可选：添加toString方法便于调试
  toString(): string {
    return `key[code=${this.key}, api=${this.api}]`
  }
}

// 导出单例
export default APICacheKey
