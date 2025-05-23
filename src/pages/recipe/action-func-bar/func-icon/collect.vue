<script setup lang="ts">
import type { RecipeInfo } from '@/api/recipe/type'
import { addToDefaultCollect, cancelUserFavor } from '@/api/user-favor'
import { ContentTypesEnum } from '@/api/user-collect/enums'
import ResponseCode from '@/constants/response-code'
import { showSuccessToast } from 'vant'

const props = defineProps({
  // 菜谱信息
  recipe: {
    type: Object as PropType<RecipeInfo>,
    required: true,
  },
})

const isFavor = ref<boolean>(props.recipe.favor) // 是否收藏

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
      }
    })
  }
}
</script>

<template>
  <van-action-bar-icon
    icon="star" text="收藏" :color="isFavor ? '#ff5000' : ''" @click="addToFavor"
  />
</template>

<style scoped>

</style>
