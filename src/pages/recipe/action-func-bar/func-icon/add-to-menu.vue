<script setup lang="ts">
import ResponseCode from '@/constants/response-code'
import { getSelfRecipeMenuList } from '@/api/recipe-menu'
import type { MenuRecipe } from '@/api/menu-recipe/type'
import { addMenuRecipe } from '@/api/menu-recipe'

const props = defineProps({
  // 菜谱ID
  recipeId: {
    type: Number,
    required: true,
  },
})

const addToPlanDialogShow = ref<boolean>(false) // 加入到日期计划弹窗

const menuRecipeForm = reactive<MenuRecipe>({
  recipeMenuId: null, // 菜单ID
  recipeId: props.recipeId, // 菜谱ID
  memo: '', // 备注
})
const isToday = ref<boolean>(false) // 是否今日

/**
 * 加入到菜谱菜单
 */
function addToMenu() {
  addMenuRecipe(menuRecipeForm).then((res) => {
    if (res.code === ResponseCode.SUCCESS.code) {
      showNotify({ type: 'success', message: `成功加入到菜单！`, duration: 1500 })
    }
  })
  return false
}
</script>

<template>
  <van-action-bar-icon
    icon="todo-list-o" text="加入菜单"
    @click="() => {
      addToPlanDialogShow = true
      isToday = false
    }"
  />

  <!-- 加入指定菜单 -->
  <van-dialog
    v-model:show="addToPlanDialogShow"
    title="加入我的菜单"
    show-cancel-button
    @confirm="addToMenu"
  >
    <mk-form-picker
      v-model="menuRecipeForm.recipeMenuId"
      :dict-type="getSelfRecipeMenuList"
      label="菜单" placeholder="点击选择菜单"
      :custom-field-name="{
        text: 'title',
        value: 'id',
      }"
    />
    <mk-form-text
      v-model="menuRecipeForm.memo"
      :maxlength="255"
      label="备注"
      placeholder="请输入备注"
    />
  </van-dialog>
</template>

<style scoped>

</style>
