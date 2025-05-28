<script setup lang="ts">
import { useRouter } from 'vue-router'
import { showSuccessToast } from 'vant'
import vw from '@/utils/inline-px-to-vw'
import ResponseCode from '@/constants/response-code'
import { SMS_SCENE_ENUM } from '@/api/auth/type'
import logo from '~/images/logo.svg'
import logoDark from '~/images/logo-dark.svg'
import { sendSmsCode } from '@/api/auth'
import type { MemberUserResetPasswordReq } from '@/api/member/type'
import { resetUserPassword } from '@/api/member'

const { t } = useI18n()
const router = useRouter()
const loading = ref(false)
const isGettingCode = ref(false) // 是否正在获取验证码

const dark = ref<boolean>(isDark.value)

const postData = reactive<MemberUserResetPasswordReq>({
  mobile: '', // 手机号
  code: null, // 验证码
  password: null, // 密码
})

// 表单规则
const rules = reactive({
  mobile: [
    { required: true, message: t('register.pleaseEnterEmail') },
  ],
  code: [
    { required: true, message: t('register.pleaseEnterCode') },
  ],
  password: [
    { required: true, message: t('login.pleaseEnterPassword') },
  ],
})

/**
 * 重置密码
 */
async function resetPassword() {
  try {
    loading.value = true
    // 发送密码重置请求
    const res = await resetUserPassword(postData)
    if (res.code === ResponseCode.SUCCESS.code) {
      // 密码重置成功
      showSuccessToast(`密码重置成功！`)
      // 跳转到登录页面
      await router.push('/login')
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
    scene: SMS_SCENE_ENUM.MEMBER_RESET_PASSWORD, // 忘记密码
  })
  if (res.code === ResponseCode.SUCCESS.code) {
    // TODO 假验证码，后续看情况增加
    postData.code = '9999'
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

    <van-form :model="postData" :rules="rules" validate-trigger="onSubmit" @submit="resetPassword">
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
          修改密码
        </van-button>
      </div>
    </van-form>

    <GhostButton to="login" block :style="{ 'margin-top': vw(8) }">
      {{ $t('forgot-password.backToLogin') }}
    </GhostButton>
  </div>
</template>

<route lang="json5">
{
  name: 'forgot-password',
  meta: {
    i18n: 'menus.forgot-password'
  },
}
</route>
