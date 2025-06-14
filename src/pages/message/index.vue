<script setup lang="ts">
import { showToast } from 'vant'
import { useRouter } from 'vue-router'
import ConversationList from '@/pages/message/conversation-list/index.vue'

defineOptions({
  name: 'Message',
})

const router = useRouter()
</script>

<template>
  <van-row class="pt-[10px] text-center">
    <van-col :span="8" @click="() => showToast('开发中')">
      <span class="text-[20px]">{{ 0 }}</span><br>
      <span class="text-[13px]">赞和收藏</span>
    </van-col>
    <van-col :span="8" @click="router.push('/message/comment')">
      <span class="text-[20px]">{{ 0 }}</span><br>
      <span class="text-[13px]">收到的评论</span>
    </van-col>
    <van-col :span="8" @click="router.push('/message/reply')">
      <span class="text-[20px]">{{ 0 }}</span><br>
      <span class="text-[13px]">回复我的</span>
    </van-col>
    <!-- 消息列表 -->
    <van-col :span="24" class="mt-[20px]">
      <ConversationList />
    </van-col>
  </van-row>
</template>

<style scoped>

</style>

<route lang="json5">
{
  name: 'Message',
  meta: {
    title: '我的消息',
    i18n: 'message.title'
  },
}
</route>
