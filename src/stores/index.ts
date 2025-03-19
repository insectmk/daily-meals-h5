import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import useUserStore from './modules/user'
// 会员相关
import useMemberStore from '@/stores/member'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export { useUserStore, useMemberStore }
export default pinia
