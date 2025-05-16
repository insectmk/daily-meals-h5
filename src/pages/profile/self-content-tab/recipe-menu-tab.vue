<script setup lang="ts">
import { createRecipeMenu, getSelfRecipeMenuPage } from '@/api/recipe-menu'
import type { RecipeMenu } from '@/api/recipe-menu/type'
import ResponseCode from '@/constants/response-code'
import { DICT_TYPE } from '@/constants/dict'

const addRecipeMenuDialogShow = ref<boolean>(false) // 添加菜谱菜单弹窗

const recipeMenuForm = reactive<RecipeMenu>({
  title: '', // 标题
  subtitle: '', // 副标题
  menuDesc: '', // 菜单描述
  menuStatus: null, // 菜单状态
  picUrl: '', // 菜单封面图
  memo: '', // 备注
})

/**
 * 添加菜谱菜单
 */
function addRecipeMenu() {
  createRecipeMenu(recipeMenuForm).then((res) => {
    if (res.code === ResponseCode.SUCCESS.code) {
      showNotify({ type: 'success', message: `菜谱菜单添加成功！`, duration: 1500 })
    }
  })
}
</script>

<template>
  <van-cell title="新建菜单" is-link @click="addRecipeMenuDialogShow = true" />
  <RecipeMenuCardList :menu-list-api="getSelfRecipeMenuPage" min-height="55vh" />
  <!-- 新建菜单弹窗 -->
  <van-dialog
    v-model:show="addRecipeMenuDialogShow"
    title="新建菜单"
    teleport="body"
    show-cancel-button
    @confirm="addRecipeMenu"
  >
    <van-field
      v-model="recipeMenuForm.title" label="标题"
      :rules="[{ required: true, message: '请填写菜单标题' }]"
      placeholder="请输入菜单标题"
    />
    <van-field
      v-model="recipeMenuForm.subtitle" label="副标题"
      :rules="[{ required: true, message: '请填写菜单副标题' }]"
      placeholder="请输入菜单副标题"
    />
    <mk-form-tiptop
      v-model="recipeMenuForm.menuDesc"
      :rules="[{ required: true, message: '请填写菜单描述' }]"
      label="步骤"
      :maxlength="2000"
    />
    <mk-form-img
      v-model="recipeMenuForm.picUrl"
      :rules="[{ required: true, message: '请上传封面' }]"
      label="封面"
    />
    <mk-form-picker
      v-model="recipeMenuForm.menuStatus"
      :rules="[{ required: true, message: '请选择菜单状态' }]"
      :dict-type="DICT_TYPE.MEALS_STATIC_RECIPE_STATUS"
      label="菜单状态" placeholder="点击选择状态"
    />
    <mk-form-text
      v-model="recipeMenuForm.memo"
      :maxlength="255"
      label="备注"
      placeholder="请输入备注"
    />
  </van-dialog>
</template>

<style scoped>

</style>
