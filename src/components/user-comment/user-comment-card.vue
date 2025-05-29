<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { UserComment } from '@/api/user-comment/type'

defineProps({
  comment: {
    type: Object as PropType<UserComment>,
    required: true,
  },
})

const router = useRouter()
</script>

<template>
  <van-card
    :title="comment.commentContent"
    :desc="comment.commentContent"
    tag="菜单"
    :thumb="comment.userAvatar"
    @click="router.push(`/recipe-menu/${comment.id}`)"
  />
</template>

<style scoped>

</style>
