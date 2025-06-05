<script setup lang="ts">
import type { User } from '@/api/user/type'
import { getUserListByNickname } from '@/api/user'
import ResponseCode from '@/constants/response-code'
import type { UserQueryListExposed } from '@/pages/search/tabs/user-query-list.type'
import { showSuccessToast } from 'vant'

const props = defineProps({
  // 查询参数
  nickname: {
    type: String,
    required: true,
  },
  minHeight: {
    type: String,
    required: false,
    default: '80vh',
  },
})

const userList = ref<User[]>([]) // 菜谱菜单列表
const loading = ref(false) // 加载

/**
 * 获取用户列表
 */
function getUserList() {
  loading.value = true
  getUserListByNickname(props.nickname).then((res) => {
    if (res.code === ResponseCode.SUCCESS.code) {
      loading.value = false
      userList.value = res.data
    }
  })
}

// 导出方法
defineExpose<UserQueryListExposed>({
  query: getUserList,
})
</script>

<template>
  <van-pull-refresh v-model="loading" @refresh="getUserList">
    <van-list
      :style="{
        minHeight,
      }"
      :immediate-check="false"
      finished-text="已经到底啦 ~"
      loading-text="加载中..."
    >
      <van-row>
        <van-col
          v-for="(user, index) in userList"
          :key="index"
          span="24"
        >
          <van-row v-if="user.nickname" class="mt-15">
            <van-col :span="5">
              <van-image
                round
                width="3.5rem"
                height="3.5rem"
                fit="cover"
                :src="user.avatar"
              />
            </van-col>
            <van-col :span="19" class="relative">
              <span>
                <span class="text-[18px] font-500">{{ user.nickname }}</span><br>
                <span class="mt-[10px] flex text-[14px]">{{ `粉丝数量：0` }}</span>
              </span>
              <span class="absolute right-0 top-[15px] text-[12px]">
                <van-tag
                  plain
                  type="primary"
                  size="large"
                  @click.stop="() => showSuccessToast('开发中')"
                >关注</van-tag>
              </span>
            </van-col>
          </van-row>
        </van-col>
      </van-row>
    </van-list>
  </van-pull-refresh>
</template>

<style scoped>

</style>
