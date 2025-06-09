<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { getUserInfo } from '@/api/user'
import type { User } from '@/api/user/type'
import { ContentTypesEnum } from '@/api/user-collect/enums'
import ResponseCode from '@/constants/response-code'
import { addToDefaultCollect, cancelUserFavor } from '@/api/user-favor'
import { showToast } from 'vant'
import { formatDate } from '@vueuse/core'
import UserContentTab from '@/pages/user/user-content-tab/index.vue'

const route = useRoute()
const router = useRouter()

const id = Number((route.params as { id: number }).id) // 路由参数：菜谱ID
const user = ref<User>()
const loading = ref<boolean>(true) // 加载中

/**
 * 获取菜谱信息
 */
getUserInfo(id).then((res) => {
  user.value = res.data
  loading.value = false // 加载完毕
})

/**
 * 返回操作
 */
function onBack() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}

/**
 * 关注用户处理
 */
function followUserHandler(user: User) {
  if (user.favor) {
    // 取消关注
    cancelUserFavor({
      contentId: user.id, // 内容编号
      contentType: ContentTypesEnum.USER, // 内容类型
    }).then((res) => {
      if (res.code === ResponseCode.SUCCESS.code) {
        user.favor = false // 已取消关注
        showToast('已取消关注')
      }
    })
  }
  else {
    // 关注
    addToDefaultCollect({
      contentId: user.id, // 内容编号
      contentType: ContentTypesEnum.USER, // 内容类型
    }).then((res) => {
      if (res.code === ResponseCode.SUCCESS.code) {
        user.favor = true // 已关注
        showToast(`已关注`)
      }
    })
  }
}
</script>

<template>
  <van-nav-bar
    title="用户信息"
    :left-text="$t('common.back')"
    left-arrow placeholder fixed
    @click-left="onBack"
  >
    <template #right>
      <van-icon name="ellipsis" size="24" />
    </template>
  </van-nav-bar>
  <div v-if="loading">
    <van-loading size="24px">
      加载中...
    </van-loading>
  </div>
  <div v-else>
    <van-row v-if="user.nickname" class="mt-15">
      <van-col :span="8">
        <van-image
          round
          width="5.5rem"
          height="5.5rem"
          fit="cover"
          :src="user.avatar"
          @click="router.push(`/user/${user.id}`)"
        />
      </van-col>
      <van-col :span="16" class="relative">
        <span>
          <span class="text-[18px] font-500">{{ user.nickname }}</span><br>
          <van-row class="pt-[10px] text-center">
            <van-col :span="8" @click="() => showToast('开发中')">
              <span class="text-[20px]">{{ 0 }}</span><br>
              <span class="text-[13px]">关注</span>
            </van-col>
            <van-col :span="8" @click="() => showToast('开发中')">
              <span class="text-[20px]">{{ 0 }}</span><br>
              <span class="text-[13px]">粉丝</span>
            </van-col>
            <van-col :span="8" @click="() => showToast('开发中')">
              <span class="text-[20px]">{{ 0 }}</span><br>
              <span class="text-[13px]">获赞与收藏</span>
            </van-col>
          </van-row>
        </span>
      </van-col>
      <van-col :span="24" class="relative">
        <span>{{ `${formatDate(new Date(user.createTime), 'YYYY/MM/DD')} 加入` }}</span>
        <span class="absolute right-0">
          <van-tag
            plain
            type="primary"
            size="large"
            class="mr-[10px]"
            @click.stop="showToast('开发中')"
          >
            <van-icon name="guide-o" />私信
          </van-tag>
          <van-tag
            plain
            type="primary"
            size="large"
            @click.stop="followUserHandler(user)"
          >
            <span v-if="user.favor"><van-icon name="success" />已关注</span>
            <span v-else><van-icon name="plus" />关注</span>
          </van-tag>
        </span>
      </van-col>
    </van-row>
    <!-- tab页 -->
    <UserContentTab :user-id="id" />
  </div>
</template>

<style scoped>

</style>

<route lang="json5">
{
  name: 'UserInfo',
  meta: {
    title: '用户信息',
    i18n: 'user.info.title',
    keepAlive: true,
    customNav: true,
  },
}
</route>
