<script setup lang="ts">
import { showToast } from 'vant'
</script>

<template>
  <van-action-bar-icon
    icon="star" text="收藏" color="#ff5000" @click="() => {
      showToast('敬请期待！！！');
    }"
  />
</template>

<style scoped>

</style>
