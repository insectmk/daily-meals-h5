<script setup lang="ts">
import router from '@/router'
import { useMemberStore } from '@/stores'
import defaultAvatar from '@/assets/images/default-avatar.svg'
import SelfContentTab from '@/pages/profile/self-content-tab/index.vue'
import { showToast } from 'vant'
import type { UserInteractData } from '@/api/user/type'
import { getUserInteractData } from '@/api/user'
import ResponseCode from '@/constants/response-code'

defineOptions({
  name: 'Profile',
})

const memberStore = useMemberStore()
const memberInfo = computed(() => memberStore.memberInfo) // 会员信息
const isLogin = computed(() => !!memberInfo.value.id) // 是否登录
const userInteractData = ref<UserInteractData>({
  follows: 0,
  fans: 0,
  likes: 0,
  collects: 0,
}) // 用户互动数据

// 获取用户互动数据
if (isLogin.value) {
  getUserInteractData(memberStore.memberInfo.id).then((res) => {
    if (res.code === ResponseCode.SUCCESS.code) {
      userInteractData.value = res.data
    }
  })
}

/**
 * 用户信息点击处理
 */
function userInfoClickHandel() {
  if (isLogin.value) {
    // 已经登录，跳转到个人信息修改页面
    router.push('/profile/edit')
    return
  }
  // 未登录跳转到登录页面
  router.push({ name: 'login', query: { redirect: 'profile' } })
}
</script>

<template>
  <div>
    <VanCellGroup :inset="true">
      <van-cell center :is-link="!isLogin" @click="userInfoClickHandel">
        <template #title>
          <van-image :src="memberInfo.avatar || defaultAvatar" round class="h-56 w-56" />
        </template>

        <template #value>
          <span v-if="isLogin">{{ memberInfo.nickname }}</span>
          <span v-else>{{ $t('profile.login') }}</span>
        </template>
      </van-cell>
      <van-row v-if="isLogin" class="p-[10px] text-center">
        <van-col :span="8" @click="() => router.push({ name: 'User', query: { tab: 'follows' } })">
          <span>{{ userInteractData.follows }}</span><br>
          <span>关注</span>
        </van-col>
        <van-col :span="8" @click="() => router.push({ name: 'User', query: { tab: 'fans' } })">
          <span>{{ userInteractData.fans }}</span><br>
          <span>粉丝</span>
        </van-col>
        <van-col :span="8" @click="() => showToast('开发中')">
          <span>{{ userInteractData.likes + userInteractData.collects }}</span><br>
          <span>获赞与收藏</span>
        </van-col>
      </van-row>
    </VanCellGroup>

    <VanCellGroup :inset="true" class="!mt-16">
      <van-cell :title="$t('profile.demo')" icon="brush-o" is-link to="/demo" />
      <van-cell title="小助手" icon="service-o" is-link to="/chat" />
      <van-cell title="我的消息" is-link to="/message">
        <template #icon>
          <van-icon class="van-badge__wrapper van-icon van-icon-service-o van-cell__left-icon" name="chat-o" badge="99+" />
        </template>
      </van-cell>
      <van-cell :title="$t('profile.settings')" icon="setting-o" is-link to="/settings" />
    </VanCellGroup>
    <!-- tab页 -->
    <SelfContentTab />
  </div>
</template>

<route lang="json5">
{
  name: 'Profile',
  meta: {
    title: '个人中心',
    i18n: 'menus.profile',
    keepAlive: true
  },
}
</route>
