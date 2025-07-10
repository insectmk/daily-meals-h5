import { defineStore } from 'pinia'

import type LocalCacheKey from '@/stores/local-cache/local-cache-key'

/**
 * 本地缓存
 */
export const useLocalCacheStore = defineStore('local-cache', () => {
  /** 设置缓存内容 */
  function setCache<T>(key: LocalCacheKey<T>, value: T): void {
    localStorage.setItem(key.key, JSON.stringify(value))
  }

  /** 获取缓存内容 */
  function getCache<T>(key: LocalCacheKey<T>): T | undefined {
    const value = localStorage.getItem(key.key)
    return value ? JSON.parse(value) as T : undefined
  }

  return {
    setCache,
    getCache,
  }
}, {
  persist: true,
})

export default useLocalCacheStore
