<script setup lang="ts">
import { formatDate } from '@vueuse/core'
import { useMessageStore } from '@/stores'
import type { UserChatConversationInfo } from '@/api/user-chat/type'
import { useRouter } from 'vue-router'
import { conversationRead, deleteConversation, markUnread, updateConversationPinned } from '@/api/user-chat'
import ResponseCode from '@/constants/response-code'

defineOptions({
  name: 'ConversationCard',
})

const props = defineProps({
  conversation: { // 对话信息
    type: Object as PropType<UserChatConversationInfo>,
    required: true,
  },
})

const emits = defineEmits(['updatePinned'])

const messageStore = useMessageStore()
const router = useRouter()

/**
 * 会话点击处理
 * @param conversation
 */
function conversationClickHandler(conversation: UserChatConversationInfo) {
  // 跳转到对应会话
  router.push(`/user-chat/${conversation.chatUserId}`)
  // 已读会话内容
  conversationRead(conversation.id)
  // 刷新store未读信息
  messageStore.setChatConversationReadById(conversation.id)
}
/**
 * 会话置顶处理
 * @param conversation 会话信息
 */
function pinnedHandler(conversation: UserChatConversationInfo) {
  // 发送请求置顶/取消置顶
  updateConversationPinned({
    id: conversation.id,
    pinned: !conversation.pinned,
  }).then((res) => {
    if (res.code === ResponseCode.SUCCESS.code) {
      // 更新前端状态
      emits('updatePinned', props.conversation.id, !props.conversation.pinned)
    }
  })
}
/**
 * 会话未读处理
 * @param conversation 会话信息
 */
function markUnreadHandler(conversation: UserChatConversationInfo) {
  const curReadStatus = messageStore.getChatUnreadMsgCountById(conversation.id) === 0 // 当前已读状态
  // 标记会话未读
  markUnread({
    id: conversation.id,
    readStatus: !curReadStatus,
  }).then((res) => {
    if (res.code === ResponseCode.SUCCESS.code) {
      // 刷新当前页面
      window.location.href = router.currentRoute.value.fullPath
    }
  })
}
/**
 * 会话删除处理
 * @param conversation 会话信息
 */
function deleteHandler(conversation: UserChatConversationInfo) {
  // 标记会话未读
  deleteConversation(conversation.id).then((res) => {
    if (res.code === ResponseCode.SUCCESS.code) {
      // 刷新当前页面
      window.location.href = router.currentRoute.value.fullPath
    }
  })
}
</script>

<template>
  <van-swipe-cell>
    <van-row class="mt-[5px] p-[5px]" @click="conversationClickHandler(conversation)">
      <van-col :span="4">
        <van-badge
          :content="messageStore.getChatUnreadMsgCountById(conversation.id)"
          :show-zero="false"
        >
          <van-image
            class="ml-[5px]"
            width="3.5rem"
            height="3.5rem"
            fit="cover"
            round
            :src="conversation.chatUserAvatar"
          />
        </van-badge>
      </van-col>
      <van-col :span="20" class="pl-[15px]">
        <!-- 顶部：名称 + 时间 -->
        <div class="mb-[5px] flex items-center justify-between">
          <span class="text-[18px] font-medium">{{ conversation.chatUserNickname }}</span>
          <span class="text-[16px] text-gray-500">{{ formatDate(new Date(conversation.lastMessageTime), 'YYYY-MM-DD') }}</span>
        </div>

        <!-- 底部：最新消息 -->
        <div class="truncate text-left text-[16px] text-gray-700">
          {{ conversation.lastMessageContent }}
        </div>
      </van-col>
    </van-row>
    <template #right>
      <van-button
        square :text="conversation.pinned ? '取消置顶' : '置顶'"
        type="primary" style="height: 100%;" @click="pinnedHandler(conversation)"
      />
      <van-button
        square :text="messageStore.getChatUnreadMsgCountById(conversation.id) === 0 ? '标为未读' : '标为已读'"
        type="warning" style="height: 100%;"
        @click="markUnreadHandler(conversation)"
      />
      <van-button
        square text="删除" type="danger" style="height: 100%;"
        @click="deleteHandler(conversation)"
      />
    </template>
  </van-swipe-cell>
</template>

<style scoped>

</style>
