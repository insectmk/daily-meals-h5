<script setup lang="ts">
import { sendSmsCode } from '@/api/auth'
import { SMS_SCENE_ENUM } from '@/api/auth/type'
import ResponseCode from '@/constants/response-code'
import { useMemberStore } from '@/stores'

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
const mobileEditPostData = reactive<SmsLoginReq>({
  mobile: '', // 手机号
  code: null, // 验证码
})
async function getCode() {
  if (!mobileEditPostData.mobile) {
    // 没有输入手机号
    showNotify({ type: 'warning', message: t('register.pleaseEnterMobile') })
    return
  }

  isGettingCode.value = true
  const res = await sendSmsCode({
    mobile: mobileEditPostData.mobile,
    scene: SMS_SCENE_ENUM.MEMBER_UPDATE_MOBILE, // 修改手机
  })
  if (res.code === ResponseCode.SUCCESS.code) {
    // TODO 假验证码，后续看情况增加
    mobileEditPostData.code = 9999
    showNotify({ type: 'success', message: `${t('register.sendCodeSuccess')}: ${9999}` })
  }

  isGettingCode.value = false
}

/**
 * 提交修改手机号的表单
 */
function editeMobileConfirm() {
  memberStore.updateMemberMobile(mobileEditPostData).then((res) => {
    if (res.code === ResponseCode.SUCCESS.code) {
      // 关闭页面
      emit('update:show', false)
      showToast('手机修改成功！')
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
          v-model.trim="mobileEditPostData.mobile"
          name="mobile"
          label="手机号"
          :placeholder="t('register.mobile')"
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
          v-model.trim="mobileEditPostData.code"
          name="code"
          label="验证码"
          :placeholder="t('register.code')"
        >
          <template #button>
            <van-button size="small" type="primary" round style="width: 85px;" @click="editeMobileConfirm">
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
