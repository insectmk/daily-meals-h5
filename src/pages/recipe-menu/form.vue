<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance } from 'vant'
import { DICT_TYPE } from '@/constants/dict'
import type { RecipeMenu } from '@/api/recipe-menu/type'
import { createOrUpdateRecipeMenu, getRecipeMenu } from '@/api/recipe-menu'
import ResponseCode from '@/constants/response-code'

defineOptions({
  name: 'RecipeMenuForm',
})

const route = useRoute()
const menuId = Number(route.query.menuId) // 菜谱菜单编号

const router = useRouter()
const formRef = ref<FormInstance>()

// 菜谱此单表单数据
const recipeMenuForm = reactive<RecipeMenu>({
  title: '', // 标题
  subtitle: '', // 副标题
  menuDesc: '', // 菜单描述
  menuStatus: null, // 菜单状态
  picUrl: '', // 菜单封面图
  memo: '', // 备注
})
// 判断是否有菜谱菜单编号，如果有的话，说明为编辑而非新增
if (menuId) {
  getRecipeMenu(menuId).then((res) => {
    if (res.code === ResponseCode.SUCCESS.code) {
      // 如果成功，替换表单
      // 保留响应式：将新对象属性合并到原对象
      Object.assign(recipeMenuForm, res.data)
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
    // 添加/修改菜谱菜单
    createOrUpdateRecipeMenu(recipeMenuForm).then((res) => {
      if (res.code === ResponseCode.SUCCESS.code) {
        // 跳转到菜谱页面
        onBack() // 返回
        showNotify({ type: 'success', message: `菜谱菜单添加成功！`, duration: 1500 })
      }
    })
  })
}
</script>

<template>
  <van-nav-bar
    :title="menuId ? $t('recipe-menu.edit.title') : $t('recipe-menu.add.title')"
    :left-text="$t('common.cancel')"
    :right-text="$t('common.done')"
    left-arrow placeholder fixed
    @click-left="onBack"
    @click-right="onConfirm"
  />
  <van-form ref="formRef" @submit="onConfirm">
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
    <mk-form-rich-text
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
  </van-form>
</template>

<style scoped>

</style>

<route lang="json5">
{
  name: 'RecipeMenuForm',
  meta: {
    i18n: 'recipe.add.title',
    customNav: true,
  },
}
</route>
