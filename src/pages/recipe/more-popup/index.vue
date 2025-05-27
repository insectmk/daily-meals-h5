<script setup lang="ts">
import { showConfirmDialog, showToast } from 'vant'
import type { RecipeInfo } from '@/api/recipe/type'
import { useRouter } from 'vue-router'
import { deleteRecipe } from '@/api/recipe'
import ResponseCode from '@/constants/response-code'

const props = defineProps({
  // 控制prop显示
  show: {
    type: Boolean,
    required: true,
  },
  // 菜谱信息
  recipe: {
    type: Object as PropType<RecipeInfo>,
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
 * 打开菜谱编辑页面
 */
function openEditForm() {
  // 打开录入页面
  router.push({
    name: 'RecipeForm', // 需指定路由名称
    query: { recipeId: props.recipe.id },
  })
}
/**
 * 删除菜谱
 */
function deleteRecipeById() {
  showConfirmDialog({
    title: '警告',
    message:
      '确认要删除该菜谱吗？不能撤回哟~',
  })
    .then(() => {
      deleteRecipe(props.recipe.id).then((res) => {
        if (res.code === ResponseCode.SUCCESS.code) {
          showNotify({ type: 'success', message: `菜谱删除成功！`, duration: 1500 })
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
      v-if="recipe.selfRecipe"
      :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
    >
      快捷操作
    </van-divider>
    <van-grid v-if="recipe.selfRecipe">
      <van-grid-item
        icon="records-o" text="编辑菜谱" @click="openEditForm"
      />
      <van-grid-item
        icon="delete-o" text="删除菜谱" @click="deleteRecipeById"
      />
    </van-grid>
  </van-popup>
</template>

<style scoped>

</style>
