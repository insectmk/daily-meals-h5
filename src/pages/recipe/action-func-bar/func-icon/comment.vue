<script setup lang="ts">
import { showToast } from 'vant'
</script>

<template>
  <van-action-bar-icon
    icon="chat-o" text="评论" @click="() => {
      showToast('敬请期待！！！');
    }"
  />
</template>

<style scoped>

</style>
