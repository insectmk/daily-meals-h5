<script setup lang="ts">
import type { User } from '@/api/user/type'
import ResponseCode from '@/constants/response-code'
import { addToDefaultCollect, cancelUserFavor } from '@/api/user-favor'
import { ContentTypesEnum } from '@/api/user-collect/enums'
import type { CommonResult, PageParam, PageResult } from '@/api/type'
import type { UserQueryListExposed } from '@/components/user/user-card-list.type'
import { useRouter } from 'vue-router'

const props = defineProps({
  // 获取菜谱的接口
  listApi: {
    type: Function as PropType<(pageParam: PageParam) => Promise<CommonResult<PageResult<User>>>>,
    required: true,
  },
  // 查询参数
  queryParam: {
    type: Object as PropType<any>,
    required: false,
  },
  minHeight: {
    type: String,
    required: false,
    default: '80vh',
  },
  // 是否直接查询
  isAutoQuery: {
    type: Boolean,
    required: false,
    default: true,
  },
})

const router = useRouter()

let pageNo = 0 // 当前页
const pageSize = 10 // 每页行数
const userList = ref<User[]>([]) // 菜谱菜单列表
const loading = ref(false) // 加载
const finished = ref(false) // 结束

const refreshing = ref<boolean>(false) // 下拉刷新

/**
 * 加载更多
 */

/**
 * 加载
 */
function onLoad() {
  pageNo++ // 页面加1
  // 获取菜单
  props.listApi({
    pageNo,
    pageSize,
    ...props.queryParam,
  }).then((res) => {
    // 刷新加载状态
    refreshing.value = false
    // 将菜谱添加到列表中
    res.data.list.forEach((menu) => {
      userList.value.push(menu)
    })
    // 关闭加载
    loading.value = false
    if (res.data.list.length < pageSize) {
      // 所有数据刷新完成
      finished.value = true
    }
  })
}

/**
 * 下拉刷新
 */
function onRefresh() {
  // 清空列表数据
  finished.value = false
  userList.value = []
  pageNo = 0 // 当前页
  // 重新加载数据
  onLoad()
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true
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
  query: onRefresh,
})
</script>

<template>
  <van-pull-refresh v-model="loading" @refresh="onRefresh">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      :style="{
        minHeight,
      }"
      :immediate-check="isAutoQuery"
      finished-text="已经到底啦 ~"
      loading-text="加载中..."
      @load="onLoad"
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
                @click="router.push(`/user/${user.id}`)"
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
                >
                  <span v-if="user.favor"><van-icon name="success" />已关注</span>
                  <span v-else><van-icon name="plus" />关注</span>
                </van-tag>
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
