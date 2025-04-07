import { defineStore } from 'pinia'
import type { RouteRecordName } from 'vue-router'
import type { EnhancedRouteLocation } from '@/router/types'

/**
 * 路由页面缓存
 */
const useRouteCacheStore = defineStore('route-cache', () => {
  const routeCaches = ref<RouteRecordName[]>([])

  /**
   * 添加缓存
   * @param route
   */
  const addRoute = (route: EnhancedRouteLocation) => {
    if (routeCaches.value.includes(route.name))
      return

    if (route?.meta?.keepAlive)
      routeCaches.value.push(route.name)
  }

  // 移除缓存（基于组件名）
  const removeCache = (componentName: string) => {
    routeCaches.value = routeCaches.value.filter(r => r !== componentName)
  }

  return {
    routeCaches,
    addRoute,
    removeCache,
  }
})

export default useRouteCacheStore
