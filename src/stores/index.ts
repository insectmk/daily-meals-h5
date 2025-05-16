import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import useUserStore from './modules/user'
// 会员相关
import useMemberStore from '@/stores/member'
// 字典相关
import useDictStore from '@/stores/dictionary'
// API缓存相关
import useApiCacheStore from '@/stores/api-cache'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export { useUserStore, useMemberStore, useDictStore, useApiCacheStore }
export default pinia
