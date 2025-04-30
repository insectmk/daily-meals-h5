<script setup lang="ts">
import { useRouter } from 'vue-router'

import logo from '~/images/logo.svg'
import logoDark from '~/images/logo-dark.svg'
import vw from '@/utils/inline-px-to-vw'
import { useMemberStore } from '@/stores'
import type { LoginData } from '@/api/user'
import ResponseCode from '@/constants/response-code'

const { t } = useI18n()
const router = useRouter()
const memberStore = useMemberStore()
const loading = ref(false)

const dark = ref<boolean>(isDark.value)

watch(
  () => isDark.value,
  (newMode) => {
    dark.value = newMode
  },
)

const postData = reactive<LoginData>({
  mobile: '',
  password: '',
})
/**
 * 表单校验规则
 */
const rules = reactive({
  mobile: [
    { required: true, message: t('login.pleaseEnterEmail') },
  ],
  password: [
    { required: true, message: t('login.pleaseEnterPassword') },
  ],
})

/**
 * 登录
 * @param values
 */
async function login(values: LoginData) {
  try {
    loading.value = true
    const result = await memberStore.login({ ...postData, ...values })
    if (result.code === ResponseCode.SUCCESS.code) {
      const { redirect, ...othersQuery } = router.currentRoute.value.query
      // todo 跳转到未登陆前的页面
      await router.push({
        name: 'home',
        query: {
          ...othersQuery,
        },
      })
    }
    else {
      // 提示消息
      showNotify({
        type: 'danger',
        message: result.msg,
      })
    }
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="m-x-a w-7xl text-center">
    <div class="mb-32 mt-20">
      <van-image :src="dark ? logoDark : logo" class="h-120 w-120" alt="brand logo" />
    </div>

    <van-form :model="postData" :rules="rules" validate-trigger="onSubmit" @submit="login">
      <div class="overflow-hidden rounded-3xl">
        <van-field
          v-model="postData.mobile"
          :rules="rules.mobile"
          name="mobile"
          :placeholder="t('login.mobile')"
        />
      </div>

      <div class="mt-16 overflow-hidden rounded-3xl">
        <van-field
          v-model="postData.password"
          type="password"
          :rules="rules.password"
          name="password"
          :placeholder="t('login.password')"
        />
      </div>

      <div class="mt-16">
        <van-button
          :loading="loading"
          type="primary"
          native-type="submit"
          round block
        >
          {{ $t('login.login') }}
        </van-button>
      </div>
    </van-form>

    <GhostButton block to="register" :style="{ 'margin-top': vw(18) }">
      {{ $t('login.sign-up') }}
    </GhostButton>

    <GhostButton block to="forgot-password">
      {{ $t('login.forgot-password') }}
    </GhostButton>
  </div>
</template>

<route lang="json5">
{
  name: 'login',
  meta: {
    i18n: 'menus.login'
  },
}
</route>
