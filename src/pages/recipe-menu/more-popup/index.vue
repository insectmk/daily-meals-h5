<script setup lang="ts">
import { showConfirmDialog, showToast } from 'vant'
import type { RecipeMenu } from '@/api/recipe-menu/type'
import { useRouter } from 'vue-router'
import { deleteRecipeMenu } from '@/api/recipe-menu'
import ResponseCode from '@/constants/response-code'

const props = defineProps({
  // 控制prop显示
  show: {
    type: Boolean,
    required: true,
  },
  // 菜谱菜单信息
  menu: {
    type: Object as PropType<RecipeMenu>,
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
 * 打开菜谱菜单编辑页面
 */
function openEditForm() {
  // 打开录入页面
  router.push({
    name: 'RecipeMenuForm', // 需指定路由名称
    query: { menuId: props.menu.id },
  })
}
/**
 * 删除菜谱菜单
 */
function deleteRecipeMenuById() {
  showConfirmDialog({
    title: '警告',
    message:
      '确认要删除该菜单吗？不能撤回哟~',
  })
    .then(() => {
      deleteRecipeMenu(props.menu.id).then((res) => {
        if (res.code === ResponseCode.SUCCESS.code) {
          showNotify({ type: 'success', message: `菜单删除成功！`, duration: 1500 })
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
      :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
    >
      分享到
    </van-divider>
    <van-grid>
      <van-grid-item
        icon="miniprogram-o" text="复制链接" @click="copyCurrentURL"
      />
    </van-grid>
    <van-divider
      v-if="menu.selfMenu"
      :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
    >
      快捷操作
    </van-divider>
    <van-grid v-if="menu.selfMenu">
      <van-grid-item
        icon="records-o" text="编辑菜单" @click="openEditForm"
      />
      <van-grid-item
        icon="delete-o" text="删除菜单" @click="deleteRecipeMenuById"
      />
    </van-grid>
  </van-popup>
</template>

<style scoped>

</style>
