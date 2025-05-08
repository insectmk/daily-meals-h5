<script setup lang="ts">
import { DICT_TYPE } from '@/constants/dict'
import type { CreatePlanReq } from '@/api/dailyplan/type'
import { addRecipesPlan } from '@/api/dailyplan'
import ResponseCode from '@/constants/response-code'
import useRouteCacheStore from '@/stores/modules/routeCache'

const props = defineProps({
  // 菜谱ID
  recipeId: {
    type: Number,
    required: true,
  },
})

const { t } = useI18n() // 国际化
const addToPlanDialogShow = ref<boolean>(false) // 加入到日期计划弹窗

const dailyPlanForm = reactive<CreatePlanReq>({
  recipeIds: [], // 菜谱ID
  planDate: Date.now(), // 计划日期
  mealType: 0, // 计划类型
  memo: '', // 备注
})

/**
 * 加入到菜谱计划
 */
function addToPlan() {
  dailyPlanForm.recipeIds = [props.recipeId] // 菜谱ID
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
  <van-action-bar-button
    type="danger" color="#7232dd" :text="t('recipe.info.addPlan')"
    @click="addToPlanDialogShow = true"
  />

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
</template>

<style scoped>

</style>
