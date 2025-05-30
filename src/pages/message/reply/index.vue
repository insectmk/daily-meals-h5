<script setup lang="ts">
import router from '@/router'
import { getCommentPage } from '@/api/user-comment'

defineOptions({
  name: 'MessageReply',
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
    :title="$t('message.reply.title')"
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
name: 'MessageReply',
meta: {
  title: '回复我的',
  i18n: 'message.reply.title',
  customNav: true,
},
}
</route>
