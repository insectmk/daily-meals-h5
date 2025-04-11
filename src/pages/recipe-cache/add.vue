<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { RecipeCreateReq } from '@/api/recipe/type'

defineOptions({
  name: 'RecipeAdd',
})

const router = useRouter()

// 菜谱表单数据
const recipeForm = reactive<RecipeCreateReq>({
  name: '', // 菜谱名称
  recipeDesc: '', // 菜谱描述
  recipeStep: '', // 菜谱教程
  memo: '', // 菜谱备注
})

/**
 * 返回操作
 */
function onBack() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}
/**
 * 完成操作
 */
function onConfirm() {
  console.warn(recipeForm, '表单数据')
}
</script>

<template>
  <van-nav-bar
    :title="$t('recipe.add.title')"
    :left-text="$t('common.cancel')"
    :right-text="$t('common.done')"
    left-arrow placeholder fixed
    @click-left="onBack"
    @click-right="onConfirm"
  />
  <van-form>
    <van-field v-model="recipeForm.name" label="名称" placeholder="请输入菜谱名称" />
    <van-field v-model="recipeForm.name" label="描述" placeholder="请输入菜谱描述" />
    <mk-form-tiptop
      v-model="recipeForm.recipeStep"
      label="步骤"
      :maxlength="2000"
    />
    <mk-form-text
      v-model="recipeForm.memo"
      label="备注"
      :maxlength="256"
    />
  </van-form>
</template>

<style scoped>

</style>

<route lang="json5">
{
  name: 'RecipeAdd',
  meta: {
    i18n: 'recipe.add.title',
    keepAlive: true,
    customNav: true,
  },
}
</route>
