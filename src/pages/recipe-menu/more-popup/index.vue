<script setup lang="ts">
import { showToast } from 'vant'
import type { RecipeMenu } from '@/api/recipe-menu/type'
import { useRouter } from 'vue-router'

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
        icon="delete-o" text="删除菜单" @click="() => {
          showToast('敬请期待！！！');
        }"
      />
    </van-grid>
  </van-popup>
</template>

<style scoped>

</style>
