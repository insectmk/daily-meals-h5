<script setup lang="ts">
import { showConfirmDialog, showSuccessToast, showToast } from 'vant'
import { useRouter } from 'vue-router'
import { deleteRecipeMenu } from '@/api/recipe-menu'
import ResponseCode from '@/constants/response-code'
import type { UserCollect } from '@/api/user-collect/type'
import { ContentTypesEnum } from '@/api/user-collect/enums'

const props = defineProps({
  // 控制prop显示
  show: {
    type: Boolean,
    required: true,
  },
  // 用户收藏夹信息
  userCollect: {
    type: Object as PropType<UserCollect>,
    required: true,
  },
})

const emit = defineEmits(['update:show'])

const router = useRouter()

/**
 * 复制当前URL到剪切板
 */
async function copyCurrentURL() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    showToast('复制成功！')
  }
  catch (err) {
    console.error('复制失败:', err)
    showToast('复制失败，请手动复制！')
  }
}
/**
 * 打开编辑页面
 */
function openEditForm() {
  // 打开录入页面
  router.push({
    name: 'UserCollectForm', // 需指定路由名称
    query: {
      userContentId: props.userCollect.id, // 收藏夹ID
      contentType: ContentTypesEnum.RECIPE, // 内容类型-菜谱
    },
  })
}
/**
 * 删除
 */
function deleteById() {
  showConfirmDialog({
    title: '警告',
    message:
      '确认要删除该收藏夹吗？不能撤回哟~',
  })
    .then(() => {
      deleteRecipeMenu(props.userCollect.id).then((res) => {
        if (res.code === ResponseCode.SUCCESS.code) {
          showSuccessToast('收藏夹删除成功!')
          // 返回到上一个页面
          if (window.history.state.back)
            history.back()
          else
            router.replace('/')
        }
      })
    })
    .catch(() => {
      // on cancel
    })
}
</script>

<template>
  <!-- 更多操作弹窗 -->
  <van-popup
    :show="show"
    position="bottom"
    @close="emit('update:show', false)"
  >
    <van-divider
      :style="{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)', padding: '0 16px' }"
    >
      分享到
    </van-divider>
    <van-grid>
      <van-grid-item
        icon="miniprogram-o" text="复制链接" @click="copyCurrentURL"
      />
    </van-grid>
    <van-divider
      :style="{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)', padding: '0 16px' }"
    >
      快捷操作
    </van-divider>
    <van-grid>
      <van-grid-item
        icon="records-o" text="编辑收藏夹" @click="openEditForm"
      />
      <van-grid-item
        icon="delete-o" text="删除收藏夹" @click="deleteById"
      />
    </van-grid>
  </van-popup>
</template>

<style scoped>

</style>
