<script setup lang="ts">
import { getFanUsersPage, getFollowUsersPage } from '@/api/user'
import { useRoute } from 'vue-router'
import UserCardList from '@/components/user/user-card-list.vue'

defineOptions({
  name: 'User',
})

const route = useRoute()
const tabActive = ref(String(route.query.tab)) // 当前所在tab
</script>

<template>
  <van-tabs
    v-model:active="tabActive"
    animated swipeable sticky
    background="transparent"
  >
    <van-tab name="follows">
      <template #title>
        关注
      </template>
      <UserCardList
        :list-api="getFollowUsersPage"
        min-height="80vh"
      />
    </van-tab>
    <van-tab name="fans">
      <template #title>
        粉丝
      </template>
      <UserCardList
        :list-api="getFanUsersPage"
        min-height="80vh"
      />
    </van-tab>
  </van-tabs>
</template>

<route lang="json5">
{
  name: 'User',
  meta: {
    title: '用户列表',
    i18n: 'user.title',
  },
}
</route>
