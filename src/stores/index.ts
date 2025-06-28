import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import useMemberStore from '@/stores/member' // 会员相关
import useDictStore from '@/stores/dictionary' // 字典相关
import useApiCacheStore from '@/stores/api-cache' // API缓存相关
import useMessageStore from '@/stores/message' // 消息相关

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export { useMemberStore, useDictStore, useApiCacheStore, useMessageStore }
export default pinia
