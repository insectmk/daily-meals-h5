<script setup lang="ts">
import { getConversationList } from '@/api/user-chat'
import ResponseCode from '@/constants/response-code'
import type { UserChatConversationInfo } from '@/api/user-chat/type'
import { useRouter } from 'vue-router'
import { formatDate } from '@vueuse/core'
import { useMessageStore } from '@/stores'

defineOptions({
  name: 'ConversationList',
})

const router = useRouter()
const refreshing = ref<boolean>(false) // 列表刷新状态
const conversationList = ref<UserChatConversationInfo[]>([]) // 对话列表

const messageStore = useMessageStore()

// 获取用户对话列表
function getUserConversationList() {
  refreshing.value = true // 加载
  getConversationList().then((res) => {
    if (res.code === ResponseCode.SUCCESS.code) {
      conversationList.value = res.data
      refreshing.value = false // 关闭加载
    }
  })
}

onMounted(() => {
  getUserConversationList() // 获取用户对话列表
})
</script>

<template>
  <van-pull-refresh v-model="refreshing" style="height: 80vh; overflow-y: auto;" @refresh="getUserConversationList">
    <van-list>
      <van-swipe-cell v-for="conversation in conversationList" :key="conversation.id">
        <van-row class="mt-[5px] p-[5px]" @click="router.push(`/user-chat/${conversation.chatUserId}`)">
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
          <van-button square text="置顶" type="primary" style="height: 100%;" />
          <van-button square text="标为未读" type="warning" style="height: 100%;" />
          <van-button square text="删除" type="danger" style="height: 100%;" />
        </template>
      </van-swipe-cell>
    </van-list>
  </van-pull-refresh>
</template>

<style scoped>

</style>
