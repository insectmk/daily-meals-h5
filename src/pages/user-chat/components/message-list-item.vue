<script setup lang="ts">
import { useMemberStore } from '@/stores'
import type { Member } from '@/api/member/type'

defineProps({
  message: { // 消息
    type: Object as PropType<ChatMessageInfo>,
    required: true,
  },
})

const memberInfo: Member = useMemberStore().memberInfo
</script>

<template>
  <!-- 自己的消息 -->
  <div v-if="message.senderUserId === memberInfo.id" class="mb-[10px] flex items-end justify-end">
    <!-- 气泡 -->
    <div
      class="max-w-3/4 rounded-lg rounded-br-none bg-blue-500 px-3 py-2 pb-[10px] pl-[10px] pr-[10px] pt-[10px] text-white shadow"
    >
      {{ message.content }}
    </div>
    <!-- 头像 -->
    <van-image
      class="ml-[5px]"
      width="2.5rem"
      height="2.5rem"
      fit="cover"
      round
      :src="message.senderUserAvatar"
    />
  </div>

  <!-- 别人的消息 -->
  <div v-else class="mb-[10px] flex items-end justify-start">
    <!-- 头像 -->
    <van-image
      class="mr-[5px]"
      width="2.5rem"
      height="2.5rem"
      fit="cover"
      round
      :src="message.senderUserAvatar"
    />
    <!-- 气泡 -->
    <div
      class="max-w-3/4 rounded-lg rounded-bl-none bg-gray-100 px-3 py-2 pb-[10px] pl-[10px] pr-[10px] pt-[10px] text-black shadow"
    >
      {{ message.content }}
    </div>
  </div>
</template>

<style scoped>

</style>
