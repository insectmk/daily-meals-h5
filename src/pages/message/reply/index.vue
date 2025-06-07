<script setup lang="ts">
import router from '@/router'
import { getCommentPage } from '@/api/user-comment'
import { useMemberStore } from '@/stores'

defineOptions({
  name: 'MessageReply',
})

const memberStore = useMemberStore()

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
  <!-- 回复的人为自己，并且未读的 -->
  <user-comment-card-list
    :list-api="getCommentPage"
    :query-param="{
      userRead: false,
      replyUserId: memberStore.memberInfo.id,
    }"
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
