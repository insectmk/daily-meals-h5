import { getRefreshToken } from '@/utils/auth'
import type { UseWebSocketOptions, UseWebSocketReturn } from '@vueuse/core'
import { copyValueToTarget } from '@/utils/object-util'

// WebSocket 服务地址
const server = ref(
  `${`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_GLOB_WEBSOCKET_PATH}`.replace(
    'http',
    'ws',
  )}?token=${getRefreshToken()}`, // 使用 refreshToken，而不使用 accessToken 方法的原因：WebSocket 无法方便的刷新访问令牌
)

/**
 * websocket服务
 */
export function useWebSocketServer<Data = any>(customOptions?: UseWebSocketOptions): UseWebSocketReturn<Data> {
  // 默认配置
  const options = reactive<UseWebSocketOptions>({
    autoReconnect: true,
    heartbeat: true,
  })
  copyValueToTarget(options, customOptions) // 替换自定义配置到配置
  return useWebSocket(server.value, options)
}
