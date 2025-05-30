<script setup lang="ts">
import { getCommentPage } from '@/api/user-comment'
import { ContentTypesEnum } from '@/api/user-collect/enums'
import type { RecipeComment } from '@/api/recipe/type'
import { createRecipeComment } from '@/api/recipe'
import ResponseCode from '@/constants/response-code'
import { showSuccessToast } from 'vant'
import type { UserComment } from '@/api/user-comment/type'

const props = defineProps({
  // 菜谱ID
  recipeId: {
    type: Number,
    required: true,
  },
})

const showPopup = ref<boolean>(false) // 评论录入弹窗
const replyUserNickname = ref<string>('') // 回复人的名称

// 评论表单
const commentForm = reactive<RecipeComment>({
  recipeId: props.recipeId, // 菜谱编码
  commentContent: '', // 评论内容
  picUrls: [], // 评论图片地址
  // 回复的内容
  replyUserId: null, // 回复的用户编号
  replyUserNickname: '', // 回复的用户名称
  replyContent: '', // 回复的内容
})

/**
 * 卡片点击处理
 * @param comment
 */
function cardClickHandler(comment: UserComment) {
  replyUserNickname.value = comment.userNickname // 回复人名称
  showPopup.value = true // 打开评论录入弹窗
  // 设置表单，回复人信息
  commentForm.replyUserId = comment.userId
  commentForm.replyUserNickname = comment.userNickname
  commentForm.replyContent = comment.commentContent
}

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
  <van-row>
    <van-col :span="24" class="relative mb-20">
      <span class="text-[18px] font-600">全部评论</span>
      <span class="absolute right-0 top-0 text-[16px]">全部.最新</span>
    </van-col>
  </van-row>
  <user-comment-card-list
    :list-api="getCommentPage"
    :query-param="{
      contentId: recipeId,
      contentType: ContentTypesEnum.RECIPE,
    }"
    min-height="0"
    @card-click="cardClickHandler"
  />
  <!-- 回复评论弹窗 -->
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
      placeholder="请输入回复内容" :maxlength="1024" :label="`回复：@${replyUserNickname}`"
    />
  </van-popup>
</template>

<style scoped>

</style>
