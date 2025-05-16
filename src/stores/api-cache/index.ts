import { defineStore } from 'pinia'

import type { CommonResult } from '@/api/type'
import type APICacheKey from '@/stores/api-cache/api-cache-key'

/**
 * API缓存
 */
export const useApiCacheStore = defineStore('api-cache', () => {
  // 字典信息
  const apiCacheMap: Map<string, any> = new Map()

  // 刷新API结果
  const flushApiCache = async (apiCache: APICacheKey) => {
    const result: CommonResult<any> = await apiCache.api(apiCache.apiParams)
    apiCacheMap.set(apiCache.key, result.data)
  }

  // 获取API结果
  const getApiCache = async (apiCache: APICacheKey): Promise<any> => {
    if (apiCacheMap.has(apiCache.key)) {
      return apiCacheMap.get(apiCache.key)
    }
    // 从服务器获取字典数据
    await flushApiCache(apiCache)
    // 返回字典信息
    return apiCacheMap.get(apiCache.key)
  }

  return {
    apiCacheMap,
    flushApiCache,
    getApiCache,
  }
}, {
  persist: true,
})

export default useApiCacheStore
