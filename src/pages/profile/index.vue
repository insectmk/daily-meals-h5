<script setup lang="ts">
import router from '@/router'
import { useMemberStore } from '@/stores'
import defaultAvatar from '@/assets/images/default-avatar.svg'
import SelfContentTab from '@/pages/profile/self-content-tab/index.vue'
import type { UserInteractData } from '@/api/user/type'
import { getUserInteractData } from '@/api/user'
import ResponseCode from '@/constants/response-code'

defineOptions({
  name: 'Profile',
})

const memberStore = useMemberStore()
const memberInfo = computed(() => memberStore.memberInfo) // 会员信息
const isLogin = computed(() => !!memberInfo.value.id) // 是否登录
const favorDialogShow = ref<boolean>(false) // 获赞与收藏弹窗
const userInteractData = ref<UserInteractData>({
  follows: 0,
  fans: 0,
  likes: 0,
  collects: 0,
  recipes: 0,
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
          <van-image :src="memberInfo.avatar || defaultAvatar" fit="cover" round class="h-56 w-56" />
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
        <van-col :span="8" @click="favorDialogShow = true">
          <span>{{ userInteractData.likes + userInteractData.collects }}</span><br>
          <span>获赞与收藏</span>
        </van-col>
      </van-row>
    </VanCellGroup>

    <VanCellGroup :inset="true" class="!mt-16">
      <van-cell :title="$t('profile.demo')" icon="brush-o" is-link to="/demo" />
      <van-cell title="小助手" icon="service-o" is-link to="/chat" />
      <van-cell :title="$t('profile.settings')" icon="setting-o" is-link to="/settings" />
    </VanCellGroup>
    <!-- tab页 -->
    <SelfContentTab />
  </div>

  <!-- 获赞与收藏弹窗 -->
  <!-- 加入指定日期 -->
  <van-dialog
    v-model:show="favorDialogShow"
    title="获赞与收藏"
    confirm-button-text="我知道了"
    @confirm="favorDialogShow = false"
  >
    <van-space
      direction="vertical" fill :size="10"
      class="mt-[10px] text-center text-[18px] font-500"
    >
      <div>
        当前发布菜谱数
        <strong>{{ userInteractData.recipes }}</strong>
      </div>
      <div>
        当前获得点赞数
        <strong>{{ userInteractData.likes }}</strong>
      </div>
      <div>
        当前获得收藏数
        <strong>{{ userInteractData.collects }}</strong>
      </div>
    </van-space>
  </van-dialog>
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
