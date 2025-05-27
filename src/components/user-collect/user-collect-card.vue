<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { UserCollect } from '@/api/user-collect/type'

defineProps({
  // 用户收藏夹信息
  userCollect: {
    type: Object as PropType<UserCollect>,
    required: true,
  },
})

const router = useRouter()
</script>

<template>
  <van-card
    :title="userCollect.collectName"
    :desc="userCollect.collectDesc"
    tag="我的收藏夹"
    :thumb="userCollect.picUrl"
    @click="router.push(`/user-collect/${userCollect.id}`)"
  />
</template>

<style scoped>

</style>
