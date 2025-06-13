<script setup lang="ts">
import { useRoute } from 'vue-router'
import { sendUserChatMessage } from '@/api/user-chat'
import ResponseCode from '@/constants/response-code'
import { UserChatMessageContentTypeEnum } from '@/api/user-chat/enums'
import { useWebSocketServer } from '@/utils/websocket'
import type { ChatMessageInfo } from '@/api/user-chat/type'
import MessageList from '@/pages/user-chat/components/message-list.vue'
import type { MessageListExposed } from '@/pages/user-chat/components/message-list.type'

defineOptions({
  name: 'UserChat',
})

const route = useRoute()
const id = Number((route.params as { id: number }).id) // 路由参数：用户ID
const messageListRef = ref<MessageListExposed>(null) // 消息列表dom

/** 发起 WebSocket 连接 */
const { data } = useWebSocketServer()

watchEffect(() => {
  if (!data.value) {
    return
  }
  try {
    // 1. 收到心跳
    if (data.value === 'pong') {
      return
    }
    // 2.1 解析 type 消息类型
    const jsonMessage = JSON.parse(data.value)
    const type = jsonMessage.type
    const content: ChatMessageInfo = JSON.parse(jsonMessage.content)
    if (!type) {
      showToast(`未知的消息类型：${data.value}`)
      return
    }
    // 2.2 消息类型：user_chat_message_type
    if (type === 'user_chat_message_type') {
      messageListRef.value.addMessage(content)// 追加消息记录
      return
    }
    showToast(`未处理消息：${data.value}`)
  }
  catch (error) {
    showToast(`处理消息发生异常：${data.value}`)
    console.error(error)
  }
})

/** 发送消息 */
const sendText = ref('') // 发送内容
function handlerSend() {
  if (!sendText.value.trim()) {
    showToast('消息内容不能为空')
    return
  }
  // 发送消息
  sendUserChatMessage({
    receiverUserId: id,
    contentType: UserChatMessageContentTypeEnum.TEXT,
    content: sendText.value,
  }).then((res) => {
    if (res.code === ResponseCode.SUCCESS.code) {
      sendText.value = '' // 清空消息
      showToast('发送成功！')
    }
  })
}
</script>

<template>
  <div style="width: 100%;">
    <!--  消息列表  -->
    <MessageList ref="messageListRef" :receiver-user-id="id" />
    <van-cell-group inset>
      <van-row>
        <van-col :span="19">
          <van-field
            v-model="sendText"
            rows="1"
            autosize
            type="textarea"
            maxlength="50"
            placeholder="请输入你要发送的消息..."
            show-word-limit
          />
        </van-col>
        <van-col :span="5">
          <van-button type="primary" style="width: 100%;" @click="handlerSend">
            发送
          </van-button>
        </van-col>
      </van-row>
    </van-cell-group>
  </div>
</template>

<route lang="json5">
{
  name: 'UserChat',
  meta: {
    title: '用户聊天',
    i18n: 'user.chat.title',
  },
}
</route>
