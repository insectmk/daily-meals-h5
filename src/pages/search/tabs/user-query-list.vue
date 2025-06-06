<script setup lang="ts">
import type { User } from '@/api/user/type'
import { getUserListByNickname } from '@/api/user'
import ResponseCode from '@/constants/response-code'
import type { UserQueryListExposed } from '@/pages/search/tabs/user-query-list.type'
import { addToDefaultCollect, cancelUserFavor } from '@/api/user-favor'
import { ContentTypesEnum } from '@/api/user-collect/enums'

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
                  @click.stop="followUserHandler(user)"
                >{{ user.favor ? '已关注' : '关注' }}</van-tag>
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
