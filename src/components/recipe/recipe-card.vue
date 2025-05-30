<script setup lang="ts">
import { DICT_TYPE } from '@/constants/dict'
import type { RecipeInfo } from '@/api/recipe/type'
import { useApiCacheStore, useDictStore } from '@/stores'
import { useRouter } from 'vue-router'
import APICacheKey from '@/stores/api-cache/api-cache-key'

const props = defineProps({
  recipe: {
    type: Object as PropType<RecipeInfo>,
    required: true,
  },
})

const router = useRouter()
const dictStore = useDictStore()
const apiCacheStore = useApiCacheStore()

// 检测 swipe-right 插槽是否有内容传入
const slots = useSlots()
const hasSwipeRightContent = computed(() => {
  return !!slots['swipe-right']?.()
})

// 烹饪难度标签
const tag = ref('未知')
dictStore.getDictLabelByValueAsync(DICT_TYPE.MEALS_RECIPE_LEVEL, props.recipe.recipeLevel)
  .then((res) => {
    tag.value = res
  })
// 菜谱分类处理
const categoryList = ref<{ id: number, name: string }[]>([])
apiCacheStore.getApiCache(APICacheKey.MEALS_RECIPE_CATEGORY).then((res) => {
  const categories = res
  props.recipe.recipeCategory?.forEach((categoryId) => {
    categoryList.value.push({
      id: categoryId,
      name: categories.find(c => c.id === categoryId)!.name,
    })
  })
})
</script>

<template>
  <van-swipe-cell>
    <van-card
      :title="recipe.name"
      :desc="recipe.recipeDesc"
      :tag="tag"
      :thumb="recipe.picUrl"
      @click="router.push(`/recipe/${recipe.id}`)"
    >
      <template #tags>
        <van-tag
          v-for="(category) in categoryList"
          :key="category.id"
          plain
          class="mr-[4px]"
          type="primary"
        >
          {{ category.name }}
        </van-tag>
      </template>
    </van-card>
    <template v-if="hasSwipeRightContent" #right>
      <slot name="swipe-right" />
    </template>
  </van-swipe-cell>
</template>

<style scoped>
.delete-button {
  height: 100%;
}
</style>
