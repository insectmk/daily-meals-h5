<script setup lang="ts">
import { formatDate } from '@vueuse/core'
import type { MessageListExposed } from '@/pages/user-chat/components/message-list.type'
import { getUserChatMessageList } from '@/api/user-chat'
import ResponseCode from '@/constants/response-code'
import type { ChatMessageInfo } from '@/api/user-chat/type'
import MessageListItem from '@/pages/user-chat/components/message-list-item.vue'

const props = defineProps({
  receiverUserId: { // 接收方ID
    type: Number,
    required: true,
  },
})

const loading = ref<boolean>(false) // 加载
const finished = ref<boolean>(false) // 结束（获取完所有的消息）
const messageListRef = ref(null) // 当前组件div

/** 监听接收到的数据 */
const messageList = ref<ChatMessageInfo[]>([]) // 消息列表
const messageReverseList: ChatMessageInfo[] = computed(() => [...messageList.value].reverse()) // 排序后的消息列表

/** 获取历史消息 */
function getHistoryMessageList(callBack?: () => void) {
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
      if (callBack)
        callBack()// 执行成功回调函数
      if (res.data.length < 20)
        finished.value = true
    }
  })
}

onMounted(() => {
  // 获取消息，并滚动到最末尾
  getHistoryMessageList(scrollToBottom)
})

/**
 * 追加消息记录
 */
function addMessage(message: ChatMessageInfo) {
  messageList.value.unshift(message) // 添加到数组最前面
  scrollToBottom() // 滚动到底部
}

/**
 * 滚动到底部方法
 */
function scrollToBottom() {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

// 导出方法
defineExpose<MessageListExposed>({
  addMessage,
  scrollToBottom,
})
</script>

<template>
  <!-- 消息记录 -->
  <div ref="messageListRef" style="height: 80vh; overflow-y: auto;">
    <van-pull-refresh v-model="loading" @refresh="getHistoryMessageList">
      <van-list>
        <MessageListItem
          v-for="message in messageReverseList"
          :key="message.time" :message="message"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<style scoped>

</style>
