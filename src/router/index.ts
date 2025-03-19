import { createRouter, createWebHistory } from 'vue-router/auto'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import type { EnhancedRouteLocation } from './types'
import useRouteCacheStore from '@/stores/modules/routeCache'
import { useMemberStore } from '@/stores'

import { isLogin } from '@/utils/auth'
import setPageTitle from '@/utils/set-page-title'

NProgress.configure({ showSpinner: true, parent: '#app' })

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_PUBLIC_PATH),
  routes,
})

// 这将在运行时更新路由，而无需重新加载页面
if (import.meta.hot)
  handleHotUpdate(router)
/**
 * 路由拦截
 */
router.beforeEach(async (to: EnhancedRouteLocation) => {
  NProgress.start()

  const routeCacheStore = useRouteCacheStore()
  const memberStore = useMemberStore()

  // 路由缓存
  routeCacheStore.addRoute(to)

  // 设置页面标题
  setPageTitle(to.meta.title)
  // 查询用户信息
  if (isLogin() && !memberStore.memberInfo?.id)
    await memberStore.info()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
