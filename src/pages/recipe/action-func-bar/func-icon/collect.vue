<script setup lang="ts">
import type { RecipeInfo } from '@/api/recipe/type'
import { addToDefaultCollect, addUserFavor, cancelUserFavor } from '@/api/user-favor'
import { ContentTypesEnum } from '@/api/user-collect/enums'
import ResponseCode from '@/constants/response-code'
import { showSuccessToast } from 'vant'
import type { SimpleUserCollect } from '@/api/user-collect/type'
import { getSelfUserCollectAllSimpleList } from '@/api/user-collect'

const props = defineProps({
  // 菜谱信息
  recipe: {
    type: Object as PropType<RecipeInfo>,
    required: true,
  },
})

const isFavor = ref<boolean>(props.recipe.favor) // 是否收藏
const showPopover = ref(false) // 修改收藏夹提示
const showModifyCollectPopup = ref(false) // 修改收藏夹弹窗
const simpleUserCollectList = ref<SimpleUserCollect[]>([]) // 用户精简收藏夹列表

let timeoutId: number | null = null // 存储定时器ID的响应式变量
// 清理定时器的通用方法
function clearExistingTimeout() {
  if (timeoutId !== null) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}
/**
 * 创建定时器
 */
function createTimeout() {
  // 创建新定时器并记录ID
  timeoutId = window.setTimeout(() => {
    showPopover.value = false
  }, 4000)
}
watch(showPopover, (newVal) => {
  clearExistingTimeout() // 先清除之前的定时器

  if (newVal) {
    createTimeout()
  }
})
/**
 * 加入到收藏中
 */
function addToFavor() {
  if (isFavor.value) {
    // 取消收藏
    cancelUserFavor({
      contentId: props.recipe.id, // 内容编号
      contentType: ContentTypesEnum.RECIPE, // 内容类型
    }).then((res) => {
      if (res.code === ResponseCode.SUCCESS.code) {
        isFavor.value = false // 已取消收藏
        showSuccessToast('取消收藏')
      }
    })
  }
  else {
    // 收藏
    addToDefaultCollect({
      contentId: props.recipe.id, // 内容编号
      contentType: ContentTypesEnum.RECIPE, // 内容类型
    }).then((res) => {
      if (res.code === ResponseCode.SUCCESS.code) {
        isFavor.value = true // 已收藏
        showSuccessToast(`已收藏到${res.data.collectName}`)
        showPopover.value = true // 弹出修改收藏夹的页面
      }
    })
  }
}

/**
 * 获取收藏夹列表
 */
function getCollectList() {
  getSelfUserCollectAllSimpleList({
    contentType: ContentTypesEnum.RECIPE,
    contentId: props.recipe.id,
  }).then((res) => {
    if (res.code === ResponseCode.SUCCESS.code) {
      simpleUserCollectList.value = res.data
    }
  })
}
/**
 * 确定修改收藏夹
 */
function confirmModifyCollect() {
  const collectIds = simpleUserCollectList.value.filter(item => item.selected).map(item => item.id) ?? []
  if (collectIds.length === 0) {
    // 取消收藏
    cancelUserFavor({
      contentId: props.recipe.id, // 内容编号
      contentType: ContentTypesEnum.RECIPE, // 内容类型
    }).then((res) => {
      if (res.code === ResponseCode.SUCCESS.code) {
        isFavor.value = false // 已取消收藏
        showSuccessToast('取消收藏')
      }
    })
  }
  else {
    // 收藏
    addUserFavor({
      contentId: props.recipe.id,
      contentType: ContentTypesEnum.RECIPE,
      collectIds,
    }).then((res) => {
      if (res.code === ResponseCode.SUCCESS.code) {
        isFavor.value = true // 已收藏
        showSuccessToast('已收藏')
      }
    })
  }
  showModifyCollectPopup.value = false // 关闭修改收藏夹弹窗
}
// 组件卸载时清理
onBeforeUnmount(() => {
  clearExistingTimeout()
})
</script>

<template>
  <van-popover
    v-model:show="showPopover"
    trigger="manual"
    placement="top"
    :offset="[20, 10]"
    :show-arrow="false"
    :close-on-click-outside="true"
  >
    <div style="width: 98vw;">
      <van-cell-group inset>
        <van-cell title="已加入“默认收藏夹”" icon="checked">
          <template #value>
            <span
              @click="() => {
                getCollectList() // 获取用户收藏夹列表
                showPopover = false // 关闭修改提醒
                showModifyCollectPopup = true // 打开修改框
              }"
            >修改收藏夹</span>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    <template #reference>
      <van-action-bar-icon
        icon="star" text="收藏" :color="isFavor ? '#ff5000' : ''" @click="addToFavor"
      />
    </template>
  </van-popover>
  <!-- 圆角弹窗（底部） -->
  <van-popup
    v-model:show="showModifyCollectPopup"
    round
    position="bottom"
  >
    <van-cell-group v-for="collect in simpleUserCollectList" :key="collect.id" inset>
      <van-cell :title="collect.collectName" :label="collect.collectDesc">
        <template #right-icon>
          <van-switch v-model="collect.selected" />
        </template>
      </van-cell>
    </van-cell-group>
    <van-sticky offset-bottom="0" position="bottom">
      <van-button type="primary" block @click="confirmModifyCollect">
        确定
      </van-button>
    </van-sticky>
  </van-popup>
</template>

<style scoped>

</style>
