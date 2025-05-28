<script setup lang="ts">
import { useRouter } from 'vue-router'

import logo from '~/images/logo.svg'
import logoDark from '~/images/logo-dark.svg'
import vw from '@/utils/inline-px-to-vw'
import { useMemberStore } from '@/stores'
import ResponseCode from '@/constants/response-code'
import { SMS_SCENE_ENUM } from '@/api/auth/type'
import type { SmsLoginReq } from '@/api/auth/type'
import { sendSmsCode } from '@/api/auth'
import { showSuccessToast } from 'vant'

defineOptions({
  name: 'SmsCodeLogin',
})

const { t } = useI18n()
const router = useRouter()
const loading = ref(false)
const isGettingCode = ref(false) // 是否正在获取验证码
const memberStore = useMemberStore()

const dark = ref<boolean>(isDark.value)

const postData = reactive<SmsLoginReq>({
  mobile: '', // 手机号
  code: null, // 验证码
})

// 表单规则
const rules = reactive({
  mobile: [
    { required: true, message: t('register.pleaseEnterEmail') },
  ],
  code: [
    { required: true, message: t('register.pleaseEnterCode') },
  ],
})

/**
 * 用户登录
 */
async function login() {
  try {
    loading.value = true
    // 发送登录请求
    const res = await memberStore.smsLogin(postData)
    if (res.code === ResponseCode.SUCCESS.code) {
      // 登录成功
      showSuccessToast(`登录成功！`)
      // 跳转到个人中心页面
      await router.push('/profile')
    }
  }
  finally {
    loading.value = false
  }
}

const buttonText = computed(() => {
  return isGettingCode.value ? t('register.gettingCode') : t('register.getCode')
})

/**
 * 获取验证码
 */
async function getCode() {
  if (!postData.mobile) {
    // 没有输入手机号
    showNotify({ type: 'warning', message: t('register.pleaseEnterMobile') })
    return
  }

  isGettingCode.value = true
  const res = await sendSmsCode({
    mobile: postData.mobile,
    scene: SMS_SCENE_ENUM.MEMBER_LOGIN,
  })
  if (res.code === ResponseCode.SUCCESS.code) {
    // TODO 假验证码，后续看情况增加
    postData.code = 9999
    showNotify({ type: 'success', message: `${t('register.sendCodeSuccess')}: ${9999}` })
  }

  isGettingCode.value = false
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
          v-model.trim="postData.mobile"
          :rules="rules.mobile"
          name="mobile"
          :placeholder="t('register.mobile')"
        />
      </div>

      <div class="mt-16 overflow-hidden rounded-3xl">
        <van-field
          v-model.trim="postData.code"
          :rules="rules.code"
          name="code"
          :placeholder="t('register.code')"
        >
          <template #button>
            <van-button size="small" type="primary" plain @click="getCode">
              {{ buttonText }}
            </van-button>
          </template>
        </van-field>
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
        <GhostButton block to="login">
          {{ $t('login.password-login') }}
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
  name: 'SmsCodeLogin',
  meta: {
    i18n: 'login.sms-code-login'
  },
}
</route>
