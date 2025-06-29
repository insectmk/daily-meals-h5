<script setup lang="ts">
import { useRouter } from 'vue-router'

import logo from '~/images/logo.svg'
import logoDark from '~/images/logo-dark.svg'
import vw from '@/utils/inline-px-to-vw'
import { useMemberStore } from '@/stores'
import ResponseCode from '@/constants/response-code'
import useRouteCacheStore from '@/stores/modules/routeCache'
import type { LoginData } from '@/api/auth/type'

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
      useRouteCacheStore().removeAllCache() // 清除所有缓存
      const { redirect, ...othersQuery } = router.currentRoute.value.query
      await router.push({
        // @ts-expect-error path的类型是动态生成的，没法判断
        path: redirect || '/',
        query: {
          ...othersQuery,
        },
      })
      showToast('登录成功！')
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

/**
 * 跳转到验证码登录
 */
function toSmsCodeLoginHandler() {
  router.push({
    path: '/sms-code-login',
    query: {
      ...router.currentRoute.value.query,
    },
  })
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

    <van-row :style="{ 'margin-top': vw(18) }">
      <van-col :span="8">
        <GhostButton block to="register">
          {{ $t('login.sign-up') }}
        </GhostButton>
      </van-col>
      <van-col :span="8">
        <GhostButton block @click="toSmsCodeLoginHandler">
          {{ $t('login.sms-code-login') }}
        </GhostButton>
      </van-col>
      <van-col :span="8">
        <GhostButton block to="forgot-password">
          {{ $t('login.forgot-password') }}
        </GhostButton>
      </van-col>
    </van-row>
  </div>
</template>

<route lang="json5">
{
  name: 'login',
  meta: {
    i18n: 'login.password-login'
  },
}
</route>
