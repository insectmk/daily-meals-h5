<script setup lang="ts">
import { useRoute } from 'vue-router'
import { getRecipeInfo } from '@/api/recipe'
import type { RecipeInfo } from '@/api/recipe/type'
import type { CreatePlanReq } from '@/api/dailyplan/type'
import { addRecipesTodayPlan } from '@/api/dailyplan'
import ResponseCode from '@/constants/response-code'
import useRouteCacheStore from '@/stores/modules/routeCache'

const route = useRoute()
const { t } = useI18n() // 国际化

const id = (route.params as { id: number }).id // 路由参数：菜谱ID
const recipe = ref<RecipeInfo>()
const loading = ref<boolean>(true) // 加载中
const addToTodayPlanDialogShow = ref<boolean>(false) // 加载中
const dailyPlanForm = reactive<CreatePlanReq>({
  recipeIds: [], // 菜谱ID
  mealType: null, // 计划类型
  memo: '', // 备注
})
/**
 * 获取菜谱信息
 */
getRecipeInfo({ id }).then((res) => {
  recipe.value = res.data
  loading.value = false // 加载完毕
})
/**
 * 加入到今日计划
 */
function addToTodayPlan() {
  dailyPlanForm.recipeIds = [recipe.value.id]
  addRecipesTodayPlan(dailyPlanForm).then((res) => {
    if (res.code === ResponseCode.SUCCESS.code) {
      showNotify({ type: 'success', message: '成功加入今日计划！' })
      // TODO 清除菜谱计划的缓存
      const routeCacheStore = useRouteCacheStore()
      routeCacheStore.removeCache('PlanCache') // 菜谱计划
      routeCacheStore.removeCache('PlanInfo') // 计划详细信息
    }
  })
  return false
}
</script>

<template>
  <div v-if="loading">
    <van-loading size="24px">
      加载中...
    </van-loading>
  </div>
  <div v-else>
    <div v-html="recipe.recipeStep" />
    <van-action-bar safe-area-inset-bottom placeholder>
      <van-action-bar-button type="warning" color="#be99ff" :text="t('recipe.info.addPlan')" />
      <van-action-bar-button type="danger" color="#7232dd" :text="t('recipe.info.addTodayPlan')" @click="addToTodayPlanDialogShow = true" />
    </van-action-bar>
    <van-dialog
      v-model:show="addToTodayPlanDialogShow"
      title="标题"
      show-cancel-button
      @confirm="addToTodayPlan"
    >
      <van-field
        v-model="dailyPlanForm.mealType" label="计划类型"
        label-align="top" placeholder="请输入计划类型"
      />
      <van-field
        v-model="dailyPlanForm.memo"
        rows="2"
        autosize
        label="备注"
        label-align="top"
        type="textarea"
        maxlength="50"
        placeholder="请输入备注"
        show-word-limit
      />
    </van-dialog>
  </div>
</template>

<style scoped>

</style>

<route lang="json5">
{
  name: 'RecipeInfo',
  meta: {
    title: '菜谱信息',
    i18n: 'recipe.info.title',
    keepAlive: true
  },
}
</route>
