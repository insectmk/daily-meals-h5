import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import useUserStore from './modules/user'
// 会员相关
import useMemberStore from '@/stores/member'
// 字典相关
import useDictStore from '@/stores/dictionary'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export { useUserStore, useMemberStore, useDictStore }
export default pinia
