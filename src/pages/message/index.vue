<script setup lang="ts">
</script>

<template>
  <van-cell-group inset>
    <van-cell title="通知" is-link />
    <van-cell title="收到的评论" is-link to="/message/comment" />
    <van-cell title="回复我的" is-link to="/message/reply" />
  </van-cell-group>
</template>

<style scoped>

</style>

<route lang="json5">
{
  name: 'message',
  meta: {
    title: '我的消息',
    i18n: 'message.title'
  },
}
</route>
