<script setup lang="ts">
import type { UserComment } from '@/api/user-comment/type'
import { showSuccessToast } from 'vant'
import { formatDate } from '@vueuse/core'

const props = defineProps({
  comment: {
    type: Object as PropType<UserComment>,
    required: true,
  },
})

const emits = defineEmits(['cardClick'])

/**
 * 卡片点击
 */
function clickHandler() {
  emits('cardClick', props.comment)
}
</script>

<template>
  <van-row class="mb-15" @click="clickHandler">
    <van-col :span="4">
      <van-image
        round
        width="2.5rem"
        height="2.5rem"
        fit="cover"
        :src="comment.userAvatar"
      />
    </van-col>
    <van-col :span="20" class="relative">
      <span>
        <strong class="mr-4">{{ comment.userNickname }}</strong>
        <van-tag v-show="comment.commentAuthor" plain type="primary">作者</van-tag><br>
        <span>{{ formatDate(new Date(comment.createTime), 'YYYY/MM/DD HH:mm') }}</span>
      </span>
      <span class="absolute right-0 top-0 text-[12px]">
        <span class="mr-10" @click.stop="() => showSuccessToast('开发中')">点赞</span>
        <span @click.stop="() => showSuccessToast('开发中')">举报</span>
      </span>
    </van-col>
    <van-col :span="4" />
    <van-col :span="20" class="mt-5">
      {{ comment.commentContent }}
      <div v-show="comment.replyContent" class="mt-10 rounded-[1rem] bg-[#f1f1f1] p-10 text-[13px]">
        {{ `${comment.replyUserNickname}: ${comment.replyContent}` }}
      </div>
    </van-col>
  </van-row>
</template>

<style scoped>

</style>
