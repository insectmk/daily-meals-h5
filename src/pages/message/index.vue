<script setup lang="ts">
import { useRouter } from 'vue-router'
import ConversationList from '@/pages/message/conversation-list/index.vue'
import { useMessageStore } from '@/stores'

defineOptions({
  name: 'Message',
})

const router = useRouter()
const msgInteractData = useMessageStore().messageInfo.msgInteractData
const favorDialogShow = ref<boolean>(false) // 获赞与收藏弹窗
</script>

<template>
  <van-row class="pt-[10px] text-center">
    <van-col :span="8" @click="favorDialogShow = true">
      <span class="text-[20px]">{{ msgInteractData.likes + msgInteractData.collects }}</span><br>
      <span class="text-[13px]">赞和收藏</span>
    </van-col>
    <van-col :span="8" @click="router.push('/message/comment')">
      <span class="text-[20px]">{{ msgInteractData.comments }}</span><br>
      <span class="text-[13px]">收到的评论</span>
    </van-col>
    <van-col :span="8" @click="router.push('/message/reply')">
      <span class="text-[20px]">{{ msgInteractData.receives }}</span><br>
      <span class="text-[13px]">回复我的</span>
    </van-col>
    <!-- 消息列表 -->
    <van-col :span="24" class="mt-[20px]">
      <ConversationList />
    </van-col>
  </van-row>

  <!-- 获赞与收藏弹窗 -->
  <!-- 加入指定日期 -->
  <van-dialog
    v-model:show="favorDialogShow"
    title="获赞与收藏"
    confirm-button-text="我知道了"
    @confirm="favorDialogShow = false"
  >
    <van-space
      direction="vertical" fill :size="10"
      class="mt-[10px] text-center text-[18px] font-500"
    >
      <div>
        当前获得点赞数
        <strong>{{ msgInteractData.likes }}</strong>
      </div>
      <div>
        当前获得收藏数
        <strong>{{ msgInteractData.collects }}</strong>
      </div>
    </van-space>
  </van-dialog>
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
