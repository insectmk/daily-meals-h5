<script setup lang="ts">
import { getConversationList } from '@/api/user-chat'
import ResponseCode from '@/constants/response-code'
import type { UserChatConversationInfo } from '@/api/user-chat/type'
import ConversationCard from '@/pages/message/converstation-card/index.vue'

defineOptions({
  name: 'ConversationList',
})

const refreshing = ref<boolean>(false) // 列表刷新状态
const conversationList = ref<UserChatConversationInfo[]>([]) // 对话列表
// 置顶的会话
const conversationPinnedList = computed(() => {
  return conversationList.value.filter(conversation => conversation.pinned)
})
// 未置顶的会话
const conversationUnPinnedList = computed(() => {
  return conversationList.value.filter(conversation => !conversation.pinned)
})

/** 获取用户对话列表 */
function getUserConversationList() {
  refreshing.value = true // 加载
  getConversationList().then((res) => {
    if (res.code === ResponseCode.SUCCESS.code) {
      conversationList.value = res.data
      refreshing.value = false // 关闭加载
    }
  })
}

/**
 * 使用对象ID而不是索引来定位对象
 * @param conversationId
 * @param pinned
 */
function updateConversation(conversationId: number, pinned: boolean) {
  const index = conversationList.value.findIndex(c => c.id === conversationId)
  if (index !== -1) {
    // 使用响应式对象的方法确保更新被检测到
    conversationList.value = [
      ...conversationList.value.slice(0, index),
      { ...conversationList.value[index], pinned },
      ...conversationList.value.slice(index + 1),
    ]
  }
}
onMounted(() => {
  getUserConversationList() // 获取用户对话列表
})
</script>

<template>
  <van-pull-refresh v-model="refreshing" style="height: 80vh; overflow-y: auto;" @refresh="getUserConversationList">
    <van-list>
      <!-- 置顶的会话 -->
      <div class="bg-[#ebebeb]">
        <ConversationCard
          v-for="(conversation, index) in conversationPinnedList"
          :key="conversation.id"
          :conversation="conversationPinnedList[index]"
          @update-pinned="(id, pinned) => updateConversation(id, pinned)"
        />
      </div>
      <!-- 未置顶的会话 -->
      <ConversationCard
        v-for="(conversation, index) in conversationUnPinnedList"
        :key="conversation.id"
        :conversation="conversationUnPinnedList[index]"
        @update-pinned="(id, pinned) => updateConversation(id, pinned)"
      />
    </van-list>
  </van-pull-refresh>
</template>

<style scoped>

</style>
