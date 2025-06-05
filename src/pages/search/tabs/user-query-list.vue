<script setup lang="ts">
import type { RecipeMenuCardListExposed } from '@/components/recipe-menu/recipe-menu-card-list.type'
import type { User } from '@/api/user/type'
import { getUserListByNickname } from '@/api/user/index'
import ResponseCode from '@/constants/response-code'

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

onMounted(async () => {
  // 获取用户列表
  getUserList()
})

// 导出方法
defineExpose<RecipeMenuCardListExposed>({
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
          {{ user.nickname }}
        </van-col>
      </van-row>
    </van-list>
  </van-pull-refresh>
</template>

<style scoped>

</style>
