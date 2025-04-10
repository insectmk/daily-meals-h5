<script setup lang="ts">
import { routeWhiteList } from '@/config/routes'

const route = useRoute()
const router = useRouter()

const { t } = useI18n()

// 页面标题
const title = computed(() => {
  if (!route.meta)
    return ''
  return route.meta.i18n ? t(route.meta.i18n) : (route.meta.title || '')
})

// 判断是否为主页，为主页则不显示头部导航
const isShow = computed(() => route.name && routeWhiteList.includes(route.name))

/**
 * 返回操作
 */
function onBack() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}
</script>

<template>
  <van-nav-bar
    v-if="!isShow"
    :title="title"
    :left-text="t('navbar.back')"
    left-arrow placeholder fixed
    @click-left="onBack"
  >
    <template #right>
      <van-icon name="search" size="18" />
    </template>
  </van-nav-bar>
</template>
