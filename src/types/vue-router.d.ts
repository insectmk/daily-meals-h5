declare module 'vue-router' {
  interface RouteMeta {
    /** page title */
    title?: string
    /** i18n key */
    i18n?: string
    /** keepalive */
    keepAlive?: boolean
    /** 自定义头部导航 */
    customNav?: boolean
  }
}
export {}
