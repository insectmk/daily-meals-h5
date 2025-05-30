<script setup lang="ts">
import { sendSmsCode } from '@/api/auth'
import { SMS_SCENE_ENUM } from '@/api/auth/type'
import ResponseCode from '@/constants/response-code'
import { useMemberStore } from '@/stores'
import type { MemberUserUpdatePasswordReq } from '@/api/member/type'

defineProps({
  // 弹窗的显示
  show: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:show'])

const { t } = useI18n()
const memberStore = useMemberStore()

/**
 * 获取验证码
 */
const isGettingCode = ref(false) // 是否正在获取验证码
const passwordEditPostData = reactive<MemberUserUpdatePasswordReq>({
  password: '', // 密码
  code: null, // 验证码
})
async function getCode() {
  isGettingCode.value = true // 正在获取验证码
  const res = await sendSmsCode({
    mobile: memberStore.memberInfo.mobile, // 用户手机
    scene: SMS_SCENE_ENUM.MEMBER_UPDATE_PASSWORD, // 修改密码
  })
  if (res.code === ResponseCode.SUCCESS.code) {
    // TODO 假验证码，后续看情况增加
    // passwordEditPostData.code = '9999'
    showNotify({ type: 'success', message: `${t('register.sendCodeSuccess')}` })
  }

  isGettingCode.value = false
}

/**
 * 提交修改的表单
 */
function editeConfirm() {
  memberStore.updateMemberPassword(passwordEditPostData).then((res) => {
    if (res.code === ResponseCode.SUCCESS.code) {
      // 关闭页面
      emit('update:show', false)
      showToast('密码修改成功！')
    }
  })
}
</script>

<template>
  <!-- 手机修改弹出层 -->
  <van-popup
    :show="show"
    position="bottom"
    round
    :style="{ height: '20%' }"
    @close="$emit('update:show', false)"
  >
    <div class="m-x-a w-7xl text-center">
      <div class="overflow-hidden">
        <van-field
          v-model.trim="passwordEditPostData.code"
          label="验证码"
          :placeholder="t('register.code')"
        >
          <template #button>
            <van-button size="small" type="primary" round plain style="width: 85px;" @click="getCode">
              获取验证码
            </van-button>
          </template>
        </van-field>
      </div>

      <div class="mt-16 overflow-hidden">
        <van-field
          v-model.trim="passwordEditPostData.password"
          name="password"
          label="密码"
          :placeholder="t('register.password')"
        >
          <template #button>
            <van-button size="small" type="primary" round style="width: 85px;" @click="editeConfirm">
              确认
            </van-button>
          </template>
        </van-field>
      </div>
    </div>
  </van-popup>
</template>

<style scoped>

</style>
