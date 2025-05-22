<script setup lang="ts">
import { useRouter } from 'vue-router'
import { getSelfUserCollectPage } from '@/api/user-collect'
import { ContentTypesEnum } from '@/api/user-collect/enums'

const router = useRouter()

/**
 * 跳转到新增页面
 */
function toAddFrom() {
  // 打开录入页面
  router.push({
    name: 'UserCollectForm', // 需指定路由名称
    query: {
      contentType: ContentTypesEnum.RECIPE, // 内容类型-菜谱
    },
  })
}
</script>

<template>
  <van-cell
    title="新建收藏" is-link @click="toAddFrom"
  />
  <UserCollectCardList :list-api="getSelfUserCollectPage" min-height="55vh" />
</template>

<style scoped>

</style>
