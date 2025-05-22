<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import type { UserCollect } from '@/api/user-collect/type'
import { getUserCollect } from '@/api/user-collect'
import { getRecipePage } from '@/api/recipe'
import { ContentTypesEnum } from '@/api/user-collect/enums'
import MorePopup from './more-popup/index.vue'

const route = useRoute()
const router = useRouter()

const id = Number((route.params as { id: number }).id) // 路由参数：收藏夹ID
const userCollect = ref<UserCollect>()
const loading = ref<boolean>(true) // 加载中
const showMoreOperator = ref<boolean>(false) // 展示更多操作的弹窗

/**
 * 获取详细信息
 */
getUserCollect(id).then((res) => {
  userCollect.value = res.data
  loading.value = false // 加载完毕
})

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
    :title="$t('recipe.menu.info.title')"
    :left-text="$t('common.back')"
    left-arrow placeholder fixed
    @click-left="onBack"
  >
    <template #right>
      <van-icon name="ellipsis" size="24" @click="showMoreOperator = true" />
    </template>
  </van-nav-bar>
  <div v-if="loading">
    <van-loading size="24px">
      加载中...
    </van-loading>
  </div>
  <!-- 内容展示 -->
  <div v-else>
    <div v-if="userCollect.contentType === ContentTypesEnum.RECIPE">
      <h1>{{ userCollect.collectName }}</h1>
      <h2>{{ userCollect.collectDesc }}</h2>
      <RecipeCardList
        :recipe-list-api="getRecipePage" :query-param="{
          collectId: id,
        }" min-height="0"
      />
    </div>
    <div v-else>
      <h1>暂未支持的收藏类型</h1>
    </div>
    <!-- 更多操作弹窗 -->
    <MorePopup v-model:show="showMoreOperator" :user-collect="userCollect" />
  </div>
</template>

<style scoped>
</style>

<route lang="json5">
{
  name: 'UserCollectInfo',
  meta: {
    title: '用户收藏信息',
    i18n: 'recipe.info.title',
    customNav: true,
  },
}
</route>
