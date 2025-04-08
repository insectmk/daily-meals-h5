<script setup lang="ts">
import { showConfirmDialog } from 'vant'
import router from '@/router'
import { useUserStore } from '@/stores'
import { version } from '~root/package.json'

import type { PickerColumn } from 'vant'
import { languageColumns, locale } from '@/utils/i18n'

const { t } = useI18n()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

/**
 * 退出登录
 * @constructor
 */
function Logout() {
  showConfirmDialog({
    title: t('settings.comfirmTitle'),
  })
    .then(() => {
      userStore.logout()
      router.push({ name: 'home' })
    })
    .catch(() => {})
}

const showLanguagePicker = ref(false) // 语言选择的弹出框显示
const languageValues = ref<Array<string>>([locale.value]) // 语言列表
const language = computed(() => languageColumns.find(l => l.value === locale.value).text) // 当前语言
/**
 * 选择语言后
 * @param event
 * @param event.selectedOptions
 */
function onLanguageConfirm(event: { selectedOptions: PickerColumn }) {
  locale.value = event.selectedOptions[0].value as string
  showLanguagePicker.value = false
}
const checked = ref<boolean>(isDark.value) // 暗黑模式是否选中

watchEffect(() => {
  checked.value = isDark.value
})

/**
 * 切换暗黑模式
 * @param val
 */
function toggle(val: boolean) {
  checked.value = val
  toggleDark()
}
</script>

<template>
  <van-cell-group :title="$t('menus.basicSettings')" :border="false" :inset="true">
    <van-cell center :title="$t('menus.darkMode')">
      <template #right-icon>
        <van-switch
          v-model="checked"
          size="20px"
          aria-label="on/off Dark Mode"
          @change="toggle"
        />
      </template>
    </van-cell>

    <van-cell
      is-link
      :title="$t('menus.language')"
      :value="language"
      @click="showLanguagePicker = true"
    />
  </van-cell-group>

  <div class="text-center">
    <VanCellGroup :inset="true">
      <van-cell v-if="userInfo.uid" :title="$t('settings.logout')" clickable class="van-text-color" @click="Logout" />
    </VanCellGroup>

    <div class="mt-10 text-gray">
      {{ $t("settings.currentVersion") }}: v{{ version }}
    </div>
  </div>

  <van-popup v-model:show="showLanguagePicker" position="bottom">
    <van-picker
      v-model="languageValues"
      :columns="languageColumns"
      @confirm="onLanguageConfirm"
      @cancel="showLanguagePicker = false"
    />
  </van-popup>
</template>

<style scoped>
.van-text-color {
  --van-cell-text-color: var(--van-red);
}
</style>

<route lang="json5">
{
  name: 'settings',
  meta: {
    title: '我的设置',
    i18n: 'menus.settings'
  },
}
</route>
