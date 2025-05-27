<script setup lang="ts">
import { showToast } from 'vant'
</script>

<template>
  <van-action-bar-icon
    icon="share-o" text="分享" @click="() => {
      showToast('敬请期待！！！');
    }"
  />
</template>

<style scoped>

</style>
