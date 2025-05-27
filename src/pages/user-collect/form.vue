<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance } from 'vant'
import { DICT_TYPE } from '@/constants/dict'
import ResponseCode from '@/constants/response-code'
import type { UserCollect } from '@/api/user-collect/type'
import { createUserCollect, getUserCollect } from '@/api/user-collect'

defineOptions({
  name: 'UserCollectForm',
})

const route = useRoute()
const userContentId = Number(route.query.userContentId) // 用户收藏夹编号
const contentType = Number(route.query.contentType) // 内容类型

const router = useRouter()
const formRef = ref<FormInstance>()

// 菜谱此单表单数据
const userCollectForm = reactive<UserCollect>({
  contentType, // 内容类型
  collectName: '', // 收藏夹名称
  picUrl: '', // 封面图
  collectDesc: '', // 简介
  collectStatus: null, // 收藏夹状态
  defaultFlag: false, // 是否默认收藏夹
})
// 判断是否有菜谱菜单编号，如果有的话，说明为编辑而非新增
if (userContentId) {
  getUserCollect(userContentId).then((res) => {
    if (res.code === ResponseCode.SUCCESS.code) {
      // 如果成功，替换表单
      // 保留响应式：将新对象属性合并到原对象
      Object.assign(userCollectForm, res.data)
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
    // 添加/修改用户收藏夹
    createUserCollect(userCollectForm).then((res) => {
      if (res.code === ResponseCode.SUCCESS.code) {
        onBack() // 返回
        showNotify({ type: 'success', message: `收藏夹添加成功！`, duration: 1500 })
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
      v-model="userCollectForm.collectName" label="名称"
      :rules="[{ required: true, message: '请填写收藏夹名称' }]"
      placeholder="请输入收藏夹名称"
    />
    <mk-form-img
      v-model="userCollectForm.picUrl"
      :rules="[{ required: true, message: '请上传封面' }]"
      label="封面"
    />
    <mk-form-text
      v-model="userCollectForm.collectDesc"
      :maxlength="255"
      label="简介"
      placeholder="请输入简介"
    />
    <mk-form-picker
      v-model="userCollectForm.collectStatus"
      :rules="[{ required: true, message: '请选择收藏夹状态' }]"
      :dict-type="DICT_TYPE.MEALS_STATIC_RECIPE_STATUS"
      label="收藏夹状态" placeholder="点击选择状态"
    />
    <van-cell center title="是否默认收藏夹">
      <template #right-icon>
        <van-switch v-model="userCollectForm.defaultFlag" :disabled="userCollectForm.defaultFlag" />
      </template>
    </van-cell>
  </van-form>
</template>

<style scoped>

</style>

<route lang="json5">
{
  name: 'UserCollectForm',
  meta: {
    i18n: 'recipe.add.title',
    customNav: true,
  },
}
</route>
