import type { RouteLocationNormalized } from 'vue-router'

export type EnhancedRouteLocation = RouteLocationNormalized & {
  meta: {
    level?: number | unknown
    name?: string
    keepAlive?: boolean // 是否缓存
    customNav?: boolean // 是否自定义头部
  }
}
