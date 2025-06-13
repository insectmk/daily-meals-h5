<script setup lang="ts">
import { getUserChatMessageList } from '@/api/user-chat'
import ResponseCode from '@/constants/response-code'
import { formatDate } from '@vueuse/core'
import type { MessageListExposed } from '@/pages/user-chat/components/message-list.type'

const props = defineProps({
  receiverUserId: { // 接收方ID
    type: Number,
    required: true,
  },
})

/** 监听接收到的数据 */
const messageList = ref<ChatMessageInfo[]>([]) // 消息列表
const messageReverseList: ChatMessageInfo[] = computed(() => [...messageList.value].reverse()) // 排序后的消息列表

/** 获取历史消息 */
getUserChatMessageList({
  createTime: null, // 发送时间，小于该发送时间
  receiverUserId: props.receiverUserId, // 接收方用户编码
  limit: 20, // 每次查询条数，最大值为 100
}).then((res) => {
  if (res.code === ResponseCode.SUCCESS.code) {
    messageList.value.push(...res.data) // 将历史对话加入到列表中
  }
})

/**
 * 追加消息记录
 */
function addMessage(message: ChatMessageInfo) {
  messageList.value.push(message)
}

// 导出方法
defineExpose<MessageListExposed>({
  addMessage,
})
</script>

<template>
  <!-- 消息记录 -->
  <van-list
    finished-text="没有更多了"
    :style="{
      minHeight: '80vh',
    }"
  >
    <div
      v-for="msg in messageReverseList"
      :key="msg.time"
      class="rounded-lg p-3 shadow-sm"
    >
      <div class="mb-1 flex items-center justify-between">
        <div class="flex items-center">
          <span class="ml-2 text-gray-500">
            用户 ID: {{ msg.senderUserId }}
          </span>
        </div>
        <span>{{
          formatDate(new Date(msg.createTime), 'YYYY-MM-DD HH:mm:ss')
        }}</span>
      </div>
      <div class="mt-2 break-words text-gray-800">
        {{ msg.content }}
      </div>
    </div>
  </van-list>
</template>

<style scoped>

</style>
