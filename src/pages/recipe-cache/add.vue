<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { RecipeCreateReq } from '@/api/recipe/type'
import type { FormInstance } from 'vant'
import { addRecipe } from '@/api/recipe'
import ResponseCode from '@/constants/response-code'

defineOptions({
  name: 'RecipeAdd',
})

const router = useRouter()
const formRef = ref<FormInstance>()

// 菜谱表单数据
const recipeForm = reactive<RecipeCreateReq>({
  name: '', // 菜谱名称
  recipeDesc: '', // 菜谱描述
  recipeStep: '', // 菜谱教程
  memo: '', // 菜谱备注
  picUrl: '', // 封面图片
  sliderPicUrls: [], // 菜谱轮播图图片
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
  // 验证表单
  formRef.value.validate().then(() => {
    // 添加菜谱
    addRecipe(recipeForm).then((res) => {
      if (res.code === ResponseCode.SUCCESS.code) {
        // 跳转到菜谱页面
        router.push(`/recipe-cache/${res.data}`)
        showNotify({ type: 'success', message: `菜谱添加成功！`, duration: 1500 })
      }
    })
  })
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
    <mk-form-tiptop
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
    <mk-form-file
      v-model="recipeForm.picUrl"
      :rules="[{ required: true, message: '请上传封面' }]"
      label="封面"
    />
    <mk-form-file
      v-model="recipeForm.sliderPicUrls"
      multiple
      :max-count="2"
      label="轮播图"
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
