<script setup lang="ts">
import router from '@/router'
import { useMemberStore } from '@/stores'
import defaultAvatar from '@/assets/images/default-avatar.svg'

const memberStore = useMemberStore()
const memberInfo = computed(() => memberStore.memberInfo) // 会员信息
const isLogin = computed(() => !!memberInfo.value.id) // 是否登录

/**
 * 登录
 */
function login() {
  if (isLogin.value)
    return
  router.push({ name: 'login', query: { redirect: 'profile' } })
}

/**
 * 退出登录
 */
function logout() {
  console.error('退出登录-logout')
}
</script>

<template>
  <div>
    <VanCellGroup :inset="true">
      <van-cell center :is-link="!isLogin" @click="login">
        <template #title>
          <van-image :src="memberInfo.avatar || defaultAvatar" round class="h-56 w-56" />
        </template>

        <template #value>
          <span v-if="isLogin">{{ memberInfo.nickname }}</span>
          <span v-else>{{ $t('profile.login') }}</span>
        </template>
      </van-cell>
    </VanCellGroup>

    <VanCellGroup :inset="true" class="!mt-16">
      <van-cell :title="$t('profile.demo')" icon="brush-o" is-link to="/demo" />
      <van-cell :title="$t('profile.settings')" icon="setting-o" is-link to="/settings" />
      <van-cell :title="$t('profile.docs')" icon="flower-o" is-link url="https://easy-temps.github.io/easy-docs/vue3-vant-mobile/" />
    </VanCellGroup>
    <van-cell-group :inset="true" class="!mt-16">
      <van-cell :title="$t('profile.logout')" icon="delete-o">
        <template #right-icon>
          <van-button type="danger" size="mini" @click="logout">
            {{ $t('profile.logout') }}
          </van-button>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<route lang="json5">
{
  name: 'profile',
  meta: {
    title: '个人中心',
    i18n: 'menus.profile'
  },
}
</route>
