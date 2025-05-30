<script setup lang="ts">
import type { UserComment } from '@/api/user-comment/type'
import { showSuccessToast } from 'vant'
import { formatDate } from '@vueuse/core'
import { useMemberStore } from '@/stores'
import { createComment } from '@/api/user-comment'
import ResponseCode from '@/constants/response-code'

const props = defineProps({
  comment: {
    type: Object as PropType<UserComment>,
    required: true,
  },
})

const memberStore = useMemberStore()

const showPopup = ref<boolean>(false) // 评论录入弹窗
// 评论表单
const commentForm = reactive<UserComment>({
  contentId: props.comment.contentId, // 内容编码
  contentType: props.comment.contentType, // 内容类型 - 菜谱
  userNickname: memberStore.memberInfo.nickname, // 评价人昵称
  userAvatar: memberStore.memberInfo.avatar, // 评价人头像
  commentContent: '', // 评论内容
  picUrls: [], // 评论图片地址
  commentAuthor: false, // todo 是否内容作者 (转移到后端处理)
  // 回复的内容
  replyUserId: props.comment.userId, // 回复的用户编号
  replyUserNickname: props.comment.userNickname, // 回复的用户名称
  replyContent: props.comment.commentContent, // 回复的内容
})

/**
 * 提交评论
 */
function confirmComment() {
  createComment(commentForm).then((res) => {
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
  <van-row class="mb-15" @click="showPopup = true">
    <van-col :span="4">
      <van-image
        round
        width="2.5rem"
        height="2.5rem"
        fit="cover"
        src="https://insectmk.cn/static/img/head/insectmk.jpg"
      />
    </van-col>
    <van-col :span="20" class="relative">
      <span>
        <strong class="mr-4">{{ comment.userNickname }}</strong>
        <van-tag v-show="comment.commentAuthor" plain type="primary">作者</van-tag><br>
        <span>{{ formatDate(new Date(comment.createTime), 'YYYY-MM-DD HH:mm') }}</span>
      </span>
      <span class="absolute right-0 top-0 text-[12px]">
        <span class="mr-10" @click.stop="() => showSuccessToast('开发中')">点赞</span>
        <span @click.stop="() => showSuccessToast('开发中')">举报</span>
      </span>
    </van-col>
    <van-col :span="4" />
    <van-col :span="20" class="mt-5">
      {{ comment.commentContent }}
      <div v-show="comment.replyContent" class="mt-10 rounded-[1rem] bg-[#f1f1f1] p-10 text-[13px]">
        {{ `${comment.replyUserNickname}: ${comment.replyContent}` }}
      </div>
    </van-col>
  </van-row>

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
      placeholder="请输入回复内容" :maxlength="1024" :label="`回复：@${comment.userNickname}`"
    />
  </van-popup>
</template>

<style scoped>

</style>
