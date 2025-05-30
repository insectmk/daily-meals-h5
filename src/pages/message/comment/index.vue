<script setup lang="ts">
import router from '@/router'
import { getCommentPage } from '@/api/user-comment'

defineOptions({
  name: 'MessageComment',
})

/**
 * 取消操作
 */
function onCancel() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}
</script>

<template>
  <van-nav-bar
    :title="$t('message.comment.title')"
    :left-text="$t('common.back')"
    left-arrow placeholder fixed
    @click-left="onCancel"
  />
  <user-comment-card-list
    :list-api="getCommentPage"
    min-height="80vh"
  />
</template>

<style scoped>

</style>

<route lang="json5">
{
  name: 'MessageComment',
  meta: {
    title: '评论',
    i18n: 'message.title',
    customNav: true,
  },
}
</route>
