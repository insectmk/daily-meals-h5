<script setup lang="ts">
import vw from '@/utils/inline-px-to-vw'
import type { MemberUserUpdateReq } from '@/api/member/type'
import { useMemberStore } from '@/stores'
import ResponseCode from '@/constants/response-code'
import { showToast } from 'vant'
import { useRouter } from 'vue-router'
import MobileEditPopup from './mobile-edit-popup/index.vue'
import PasswordEditPopup from './password-edit-popup/index.vue'

const loading = ref(false)
const showMobileEdit = ref(false) // 展示手机修改弹出层
const showPasswordEdit = ref(false) // 展示密码修改弹出层
const memberStore = useMemberStore()
const router = useRouter()

const {
  nickname,
  avatar,
  sex,
} = memberStore.memberInfo
// 表单信息
const postData = reactive<MemberUserUpdateReq>({
  nickname,
  avatar,
  sex,
})

/**
 * 提交登录信息
 */
function onConfirm() {
  // 发送请求修改基础信息
  memberStore.updateMemberCommonInfo(postData).then((res) => {
    if (res.code === ResponseCode.SUCCESS.code) {
      // 回到个人中心页面
      router.push('/profile')
      showToast('修改成功！')
    }
    else {
      showNotify({ type: 'danger', message: res.msg, duration: 1500 })
    }
  })
}
/**
 * 取消操作
 */
function onCancel() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}
</script>

<template>
  <van-nav-bar
    :title="$t('profile.edit.title')"
    :left-text="$t('common.cancel')"
    :right-text="$t('common.done')"
    left-arrow placeholder fixed
    @click-left="onCancel"
    @click-right="onConfirm"
  />
  <!-- 头像 -->
  <div class="m-x-a w-7xl text-center">
    <van-form :model="postData" @submit="onConfirm">
      <div class="overflow-hidden rounded-3xl">
        <mk-form-img
          v-model="postData.avatar"
          :max-size="250 * 1024"
          label="头像"
        >
          <template #default>
            <van-image :src="postData.avatar" width="80" height="80" round fit="cover">
              <template #loading>
                <div class="i-carbon:camera" />
              </template>
              <!-- 新增文字描述层 -->
              <template #default>
                <div class="edit-layer">
                  <span>修改</span>
                </div>
              </template>
            </van-image>
          </template>
        </mk-form-img>
      </div>

      <div class="overflow-hidden rounded-3xl">
        <mk-form-input
          v-model="postData.nickname"
          type="number" placeholder="设置昵称" label="昵称"
        />
      </div>

      <div class="mt-16 overflow-hidden rounded-3xl">
        <mk-form-radio
          v-model="postData.sex" label="性别" :options="[{
            value: 1,
            label: '男',
          }, {
            value: 2,
            label: '女',
          }]"
        />
      </div>

      <div class="mt-16 overflow-hidden rounded-3xl">
        <van-field
          :model-value="memberStore.memberInfo.mobile"
          label="手机号"
          label-align="left"
          readonly
          right-icon="arrow"
          @click="showMobileEdit = true"
        />
      </div>

      <div class="mt-16 overflow-hidden rounded-3xl">
        <van-field
          label="登录密码"
          label-align="left"
          right-icon="arrow"
          readonly
          placeholder="点击修改登录密码"
          @click="showPasswordEdit = true"
        />
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

    <GhostButton to="login" block :style="{ 'margin-top': vw(8) }" />
  </div>

  <!-- 手机修改弹出层 -->
  <MobileEditPopup v-model:show="showMobileEdit" />
  <!-- 密码修改弹出层 -->
  <PasswordEditPopup v-model:show="showPasswordEdit" />
</template>

<style scoped>
/* 文字覆盖层 */
.edit-layer {
  /* 新增/修改以下属性 */
  min-height: 24px; /* 固定最小高度 */
  align-items: center;
  justify-content: center; /* 改为居中对齐 */
  gap: 4px; /* 添加元素间距 */
  line-height: 1; /* 消除字体默认行高影响[1,4](@ref) */
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.4); /* 半透明黑色背景 */
  color: #fff;
  display: flex;
  /* 修改以下属性 */
  padding: 2px 6px; /* 减少垂直padding */
  font-size: 12px; /* 适当缩小字号 */
  border-radius: 0 0 24px 24px; /* 根据80px图片尺寸计算：80/3.33≈24 */
}
</style>

<route lang="json5">
{
  name: 'ProfileEdit',
  meta: {
    title: '个人中心修改',
    i18n: 'profile.edit.title',
    customNav: true,
  },
}
</route>
