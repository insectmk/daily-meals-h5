<script setup lang="ts">
import type { RecipeComment, RecipeInfo } from '@/api/recipe/type'
import { createRecipeComment } from '@/api/recipe'
import ResponseCode from '@/constants/response-code'
import { showSuccessToast } from 'vant'

const props = defineProps({
  // 菜谱ID
  recipe: {
    type: Object as PropType<RecipeInfo>,
    required: true,
  },
})

const showPopup = ref<boolean>(false) // 评论录入弹窗
// 评论表单
const commentForm = reactive<RecipeComment>({
  recipeId: props.recipe.id, // 内容编码
  commentContent: '', // 评论内容
  picUrls: [], // 评论图片地址
})

/**
 * 提交评论
 */
function confirmComment() {
  createRecipeComment(commentForm).then((res) => {
    if (res.code === ResponseCode.SUCCESS.code) {
      showSuccessToast('评论成功！')
      // 清空评论内容
      commentForm.commentContent = ''
      commentForm.picUrls = []
      showPopup.value = false // 关闭录入
    }
  })
}
</script>

<template>
  <van-action-bar-icon
    icon="chat-o" text="评论" @click="showPopup = true"
  />
  <!-- 更多操作弹窗 -->
  <van-popup
    v-model:show="showPopup"
    round
    position="bottom"
  >
    <div class="van-picker__toolbar">
      <van-button type="primary" class="van-picker__cancel van-haptics-feedback" @click="showPopup = false">
        取消
      </van-button>
      <van-button type="success" class="van-haptics-feedback van-picker__confirm" @click="confirmComment">
        确认
      </van-button>
    </div>
    <mk-form-img v-model="commentForm.picUrls" :max-size="5 * 1024 * 1024" :max-count="9" label="图片" />
    <mk-form-text
      v-model="commentForm.commentContent"
      placeholder="请输入评论" :maxlength="1024" label="评论"
    />
  </van-popup>
</template>

<style scoped>

</style>
