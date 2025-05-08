<script setup lang="ts">
import { useRoute } from 'vue-router'
import { getRecipeInfo } from '@/api/recipe'
import type { RecipeInfo } from '@/api/recipe/type'
import type { CreatePlanReq } from '@/api/dailyplan/type'
import { addRecipesPlan } from '@/api/dailyplan'
import ResponseCode from '@/constants/response-code'
import useRouteCacheStore from '@/stores/modules/routeCache'
import { DICT_TYPE } from '@/constants/dict'

const route = useRoute()
const { t } = useI18n() // 国际化

const id = (route.params as { id: number }).id // 路由参数：菜谱ID
const recipe = ref<RecipeInfo>()
const loading = ref<boolean>(true) // 加载中
const addToPlanDialogShow = ref<boolean>(false) // 加入到日期计划弹窗
const dailyPlanForm = reactive<CreatePlanReq>({
  recipeIds: [], // 菜谱ID
  planDate: Date.now(), // 计划日期
  mealType: 0, // 计划类型
  memo: '', // 备注
})
const isToday = ref<boolean>(false) // 是否今日
/**
 * 获取菜谱信息
 */
getRecipeInfo({ id }).then((res) => {
  recipe.value = res.data
  loading.value = false // 加载完毕
})
/**
 * 加入到菜谱计划
 */
function addToPlan() {
  dailyPlanForm.recipeIds = [recipe.value.id] // 菜谱ID
  if (isToday.value) {
    dailyPlanForm.planDate = Date.now() // 为今日，计划日期为今日
  }
  addRecipesPlan(dailyPlanForm).then((res) => {
    if (res.code === ResponseCode.SUCCESS.code) {
      showNotify({ type: 'success', message: `成功加入到计划！`, duration: 1500 })
      // 清除菜谱计划的缓存
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
    <van-swipe :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="sliderPicUrl in recipe.sliderPicUrls" :key="sliderPicUrl">
        <van-image
          height="200"
          width="100%"
          fit="fill"
          :src="sliderPicUrl"
        />
      </van-swipe-item>
    </van-swipe>
    <div v-html="recipe.recipeStep" />
    <van-action-bar placeholder safe-area-inset-bottom>
      <van-action-bar-button
        type="warning" color="#be99ff" :text="t('recipe.info.addPlan')"
        @click="() => {
          addToPlanDialogShow = true
          isToday = false
        }"
      />
      <van-action-bar-button
        type="danger" color="#7232dd" :text="t('recipe.info.addTodayPlan')"
        @click="() => {
          addToPlanDialogShow = true
          isToday = true
        }"
      />
    </van-action-bar>
    <!-- 加入指定日期 -->
    <van-dialog
      v-model:show="addToPlanDialogShow"
      title="加入计划"
      show-cancel-button
      @confirm="addToPlan"
    >
      <mk-form-calendar
        v-model="dailyPlanForm.planDate"
        label="计划日期"
        placeholder="点击选择日期"
      />
      <mk-form-picker
        v-model="dailyPlanForm.mealType"
        :dict-type="DICT_TYPE.MEALS_MEAL_TYPE"
        label="计划类型" placeholder="点击选择类型"
      />
      <mk-form-text
        v-model="dailyPlanForm.memo"
        :maxlength="255"
        label="备注"
        placeholder="请输入备注"
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
