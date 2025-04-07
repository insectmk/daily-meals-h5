<script setup lang="ts">
import { useRoute } from 'vue-router'
import { getRecipeInfo } from '@/api/recipe'
import type { RecipeInfo } from '@/api/recipe/type'
import type { CreatePlanReq } from '@/api/dailyplan/type'
import { addRecipesPlan } from '@/api/dailyplan'
import ResponseCode from '@/constants/response-code'
import useRouteCacheStore from '@/stores/modules/routeCache'
import { formatDate } from '@vueuse/core'

const route = useRoute()
const { t } = useI18n() // 国际化

const id = (route.params as { id: number }).id // 路由参数：菜谱ID
const recipe = ref<RecipeInfo>()
const loading = ref<boolean>(true) // 加载中
const addToPlanDialogShow = ref<boolean>(false) // 加入到日期计划弹窗
const showCalendar = ref<boolean>(false) // 显示日历选择器
const dailyPlanForm = reactive<CreatePlanReq>({
  recipeIds: [], // 菜谱ID
  planDate: Date.now(), // 计划日期
  mealType: null, // 计划类型
  memo: '', // 备注
})
const calendarResult = ref<string>(formatDate(new Date(dailyPlanForm.planDate), 'YYYY-MM-DD')) // 日历显示
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

/**
 * 日期选择后
 * @param date
 */
function onCalendarConfirm(date: Date) {
  dailyPlanForm.planDate = date.getTime()
  calendarResult.value = formatDate(date, 'YYYY-MM-DD') // 表单显示的日期
  showCalendar.value = false
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
      title="标题"
      show-cancel-button
      @confirm="addToPlan"
    >
      <van-field
        v-show="!isToday"
        v-model="calendarResult"
        is-link
        readonly
        name="calendar"
        label="计划日"
        placeholder="点击选择日期"
        @click="showCalendar = true"
      />
      <van-calendar v-model:show="showCalendar" :show-confirm="false" @confirm="onCalendarConfirm" />
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
