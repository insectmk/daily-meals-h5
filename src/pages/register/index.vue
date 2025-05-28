<script setup lang="ts">
import { useRouter } from 'vue-router'
import vw from '@/utils/inline-px-to-vw'
import { sendSmsCode } from '@/api/auth'
import { SMS_SCENE_ENUM } from '@/api/auth/type'
import type { SmsLoginReq } from '@/api/auth/type'
import ResponseCode from '@/constants/response-code'
import { useMemberStore } from '@/stores'

const { t } = useI18n()
const router = useRouter()
const loading = ref(false)
const isGettingCode = ref(false) // 是否正在获取验证码
const memberStore = useMemberStore()

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
 * 注册用户
 */
async function register() {
  try {
    loading.value = true
    // 发送注册请求
    const res = await memberStore.smsLogin(postData)
    if (res.code === ResponseCode.SUCCESS.code) {
      // 注册成功
      showNotify({ type: 'success', message: t('register.registerSuccess') })
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
    // postData.code = 9999
    showNotify({ type: 'success', message: `${t('register.sendCodeSuccess')}` })
  }

  isGettingCode.value = false
}
</script>

<template>
  <div class="m-x-a w-7xl text-center">
    <van-form :model="postData" :rules="rules" validate-trigger="onSubmit" @submit="register">
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
          {{ $t('register.confirm') }}
        </van-button>
      </div>
    </van-form>

    <GhostButton to="login" block :style="{ 'margin-top': vw(8) }">
      {{ $t('register.backToLogin') }}
    </GhostButton>
  </div>
</template>

<route lang="json5">
{
  name: 'register',
  meta: {
    i18n: 'menus.register'
  },
}
</route>
