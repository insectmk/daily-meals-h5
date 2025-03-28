<script setup lang="ts">
import { routeWhiteList } from '@/config/routes'

const { t } = useI18n()
const active = ref(0)
const route = useRoute()

const show = computed(() => route.name && routeWhiteList.includes(route.name))
</script>

<template>
  <van-tabbar v-if="show" v-model="active" route placeholder>
    <!-- 首页demo -->
    <van-tabbar-item replace to="/">
      {{ t('layouts.home') }}
      <template #icon>
        <div class="i-carbon:home" />
      </template>
    </van-tabbar-item>
    <!-- 菜谱 -->
    <van-tabbar-item replace to="/recipe-cache">
      {{ t('layouts.recipe') }}
      <template #icon>
        <div class="i-carbon:home" />
      </template>
    </van-tabbar-item>
    <!-- 日程 -->
    <van-tabbar-item replace to="/plan">
      {{ t('layouts.plan') }}
      <template #icon>
        <div class="i-carbon:plan" />
      </template>
    </van-tabbar-item>
    <!-- 我的 -->
    <van-tabbar-item replace to="/profile">
      {{ t('layouts.profile') }}
      <template #icon>
        <div class="i-carbon:user" />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>
