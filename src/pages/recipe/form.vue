<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import type { RecipeFoodInfo, RecipeInfo } from '@/api/recipe/type'
import type { FormInstance } from 'vant'
import { createOrUpdateRecipe, getRecipeInfo } from '@/api/recipe'
import ResponseCode from '@/constants/response-code'
import { DICT_TYPE } from '@/constants/dict'
import { getSimpleFoodList } from '@/api/food'
import { useDictStore } from '@/stores'
import APICacheKey from '@/stores/api-cache/api-cache-key'

defineOptions({
  name: 'RecipeForm',
})

const route = useRoute()
const recipeId = Number(route.query.recipeId) // 菜谱编号

const router = useRouter()
const dictStore = useDictStore()
const formRef = ref<FormInstance>()

// 菜谱表单数据
const recipeForm = reactive<RecipeInfo>({
  name: '', // 菜谱名称
  recipeDesc: '', // 菜谱描述
  recipeStep: '', // 菜谱教程
  memo: '', // 菜谱备注
  status: 0, // 菜谱状态
  recipeCategory: [], // 菜谱分类
  recipeLevel: 0, // 烹饪难度
  picUrl: '', // 封面图片
  sliderPicUrls: [], // 菜谱轮播图图片
  foods: [], // 菜谱食材
})
// 判断是否有菜谱编号，如果有的话，说明为编辑而非新增
if (recipeId) {
  getRecipeInfo({ id: recipeId }).then((res) => {
    if (res.code === ResponseCode.SUCCESS.code) {
      // 如果成功，替换表单
      // 保留响应式：将新对象属性合并到原对象
      Object.assign(recipeForm, res.data)
    }
  })
}

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
  // 验证表单
  formRef.value.validate().then(() => {
    // 添加/修改菜谱
    createOrUpdateRecipe(recipeForm).then((res) => {
      if (res.code === ResponseCode.SUCCESS.code) {
        // 跳转到菜谱页面
        router.push(`/recipe/${res.data}`)
        showNotify({ type: 'success', message: `菜谱添加成功！`, duration: 1500 })
      }
    })
  })
}

/**
 * 格式化食材信息
 * @param food 食材信息
 */
function recipeFoodFormatter(food: RecipeFoodInfo) {
  return `${food.foodName}:${food.amount}${dictStore.getDictLabelByValue(DICT_TYPE.MEALS_FOOD_UNIT, String(food.foodUnit))}`
}
</script>

<template>
  <van-nav-bar
    :title="recipeId ? $t('recipe.edit.title') : $t('recipe.add.title')"
    :left-text="$t('common.cancel')"
    :right-text="$t('common.done')"
    left-arrow placeholder fixed
    @click-left="onBack"
    @click-right="onConfirm"
  />
  <van-form ref="formRef" @submit="onConfirm">
    <van-field
      v-model="recipeForm.name" label="名称"
      :rules="[{ required: true, message: '请填写菜谱名称' }]"
      placeholder="请输入菜谱名称"
    />
    <van-field
      v-model="recipeForm.recipeDesc"
      :rules="[{ required: true, message: '请填写菜谱描述' }]"
      label="描述" placeholder="请输入菜谱描述"
    />
    <mk-form-rich-text
      v-model="recipeForm.recipeStep"
      :rules="[{ required: true, message: '请填写菜谱步骤' }]"
      label="步骤"
      :maxlength="2000"
    />
    <mk-form-text
      v-model="recipeForm.memo"
      label="备注"
      :maxlength="256"
    />
    <mk-form-tree-select
      v-model="recipeForm.recipeCategory as number[]"
      :tree-options="APICacheKey.MEALS_RECIPE_CATEGORY"
      label="菜谱分类"
    />
    <mk-form-picker
      v-model="recipeForm.recipeLevel"
      :rules="[{ required: true, message: '请填写烹饪难度' }]"
      :dict-type="DICT_TYPE.MEALS_RECIPE_LEVEL"
      label="烹饪难度" placeholder="点击选择难度"
    />
    <mk-form-img
      v-model="recipeForm.picUrl"
      :rules="[{ required: true, message: '请上传封面' }]"
      :max-size="5 * 1024 * 1024"
      label="封面"
    />
    <mk-form-img
      v-model="recipeForm.sliderPicUrls"
      multiple
      :max-size="5 * 1024 * 1024"
      :max-count="10"
      label="轮播图"
    />
    <mk-form-items
      v-model="recipeForm.foods"
      :formatter="recipeFoodFormatter"
      :default-form-data="{
        amount: 0.0,
        foodName: '',
        foodUnit: '',
        memo: '',
      }"
      label="食材"
    >
      <template #default="{ itemData }">
        <mk-form-picker
          v-model="itemData.foodName"
          :rules="[{ required: true, message: '请选择食材' }]"
          :custom-field-name="{
            text: 'name',
            value: 'name',
          }"
          :dict-type="getSimpleFoodList"
          label="食材"
          placeholder="点击选择食材" input-abel
        />
        <mk-form-picker
          v-model="itemData.foodUnit"
          :rules="[{ required: true, message: '食材单位' }]"
          :dict-type="DICT_TYPE.MEALS_FOOD_UNIT"
          label="单位"
          :custom-field-name="{
            text: 'label',
            value: 'label',
          }"
          input-abel
        />
        <mk-form-input
          v-model="itemData.amount"
          type="number" placeholder="请输入量" label="量"
        />
        <mk-form-text
          v-model="itemData.memo"
          label="备注"
          :maxlength="256"
        />
      </template>
    </mk-form-items>
    <mk-form-picker
      v-model="recipeForm.status"
      :rules="[{ required: true, message: '请选择菜谱状态' }]"
      :dict-type="DICT_TYPE.MEALS_STATIC_RECIPE_STATUS"
      label="菜谱状态" placeholder="点击选择状态"
    />
  </van-form>
</template>

<style scoped>

</style>

<route lang="json5">
{
  name: 'RecipeForm',
  meta: {
    i18n: 'recipe.add.title',
    customNav: true,
  },
}
</route>
