<script setup lang="ts">
import type { RecipeInfo } from '@/api/recipe/type'
import { useRouter } from 'vue-router'

defineProps({
  // 菜谱列表
  recipeList: {
    type: Array as () => RecipeInfo[],
    required: true,
  },
  // 菜谱列表
  loading: {
    type: Boolean,
    required: true,
  },
  // 是否结束
  finished: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  // 加载
  'load',
  'update:loading',
])

const router = useRouter()

// 监听输入变化，触发双向绑定
function handleLoading(value: string) {
  emit('update:loading', value)
}
</script>

<template>
  <van-list
    :loading="loading"
    :finished="finished"
    finished-text="已经到底啦 ~"
    loading-text="加载中..."
    @load="$emit('load')"
    @update:loading="handleLoading"
  >
    <van-row>
      <van-col
        v-for="(recipe, index) in recipeList"
        :key="index"
        span="24"
      >
        <van-card
          :title="recipe.name"
          :desc="recipe.recipeDesc"
          tag="入门"
          :thumb="recipe.picUrl"
          @click="router.push(`/recipe-cache/${recipe.id}`)"
        >
          <template #tags>
            <van-tag plain type="primary">
              简单
            </van-tag>
          </template>
        </van-card>
      </van-col>
    </van-row>
  </van-list>
</template>

<style scoped>

</style>
