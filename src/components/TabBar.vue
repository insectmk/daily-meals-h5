<script setup lang="ts">
import { routeWhiteList } from '@/config/routes'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const { t } = useI18n()
const active = ref(0)
const route = useRoute()

const show = computed(() => route.name && routeWhiteList.includes(route.name))
const overlayShow = ref(false) // 控制遮罩层的显示

const router = useRouter()
</script>

<template>
  <van-tabbar v-if="show" v-model="active" route placeholder>
    <!-- 首页 -->
    <van-tabbar-item replace to="/">
      {{ t('layouts.home') }}
      <template #icon>
        <div class="i-carbon:home" />
      </template>
    </van-tabbar-item>
    <!-- 菜谱 -->
    <van-tabbar-item replace to="/recipe">
      {{ t('layouts.recipe') }}
      <template #icon>
        <div class="i-carbon:fruit-bowl" />
      </template>
    </van-tabbar-item>
    <!-- 添加内容 -->
    <van-tabbar-item @click="overlayShow = true">
      <template #icon>
        <div class="i-carbon:add-alt" />
      </template>
    </van-tabbar-item>
    <!-- 日程 -->
    <van-tabbar-item replace to="/plan">
      {{ t('layouts.plan') }}
      <template #icon>
        <div class="i-carbon:calendar-heat-map" />
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

  <van-overlay :show="overlayShow" @click="overlayShow = false">
    <div class="wrapper">
      <div class="block" @click.stop>
        <van-row>
          <van-col span="12">
            <van-button
              round type="primary" @click="() => {
                // 关闭遮罩层
                overlayShow = false
                // 打开录入页面
                router.push({
                  name: 'RecipeForm', // 需指定路由名称
                  //query: { recipeId: props.recipe.id },
                })
              }"
            >
              发菜谱
            </van-button>
          </van-col>
          <van-col span="12">
            <van-button
              round type="success" @click="() => {
                showToast('敬请期待！！！');
              }"
            >
              发笔记
            </van-button>
          </van-col>
        </van-row>
      </div>
    </div>
  </van-overlay>
</template>

<style>
.wrapper {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: flex-end; /* 垂直靠下 */
  height: 100%;
  padding-bottom: 20px; /* 底部留白 */
}

.block {
  width: 60vw;
  height: 120px;
  color: #ffffff;
  text-align: center;
}
</style>
