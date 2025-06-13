<script setup lang="ts">
import { formatDate } from '@vueuse/core'
import type { MessageListExposed } from '@/pages/user-chat/components/message-list.type'
import { getUserChatMessageList } from '@/api/user-chat'
import ResponseCode from '@/constants/response-code'
import type { ChatMessageInfo } from '@/api/user-chat/type'

const props = defineProps({
  receiverUserId: { // 接收方ID
    type: Number,
    required: true,
  },
})

const loading = ref<boolean>(false) // 加载
const finished = ref<boolean>(false) // 结束（获取完所有的消息）

/** 监听接收到的数据 */
const messageList = ref<ChatMessageInfo[]>([]) // 消息列表
const messageReverseList: ChatMessageInfo[] = computed(() => [...messageList.value].reverse()) // 排序后的消息列表

/** 获取历史消息 */
function getHistoryMessageList() {
  if (finished.value) {
    loading.value = false
    showToast('已经到顶了~')
    return
  }

  loading.value = true // 加载中
  const messageLen = messageList.value.length // 消息长度
  getUserChatMessageList({
    createTime: messageLen > 0
      ? formatDate(new Date(messageList.value[messageLen - 1].createTime), 'YYYY-MM-DD HH:mm:ss')
      : null, // 发送时间，小于该发送时间
    receiverUserId: props.receiverUserId, // 接收方用户编码
    limit: 20, // 每次查询条数，最大值为 100
  }).then((res) => {
    if (res.code === ResponseCode.SUCCESS.code) {
      messageList.value.push(...res.data) // 将历史对话加入到列表中
      loading.value = false // 加载完毕
      if (res.data.length < 20)
        finished.value = true
    }
  })
}

getHistoryMessageList()

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
  <van-pull-refresh v-model="loading" @refresh="getHistoryMessageList">
    <van-list
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
  </van-pull-refresh>
</template>

<style scoped>

</style>
