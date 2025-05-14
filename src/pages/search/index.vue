<script setup lang="ts">
import { useRouter } from 'vue-router'
import { getRecipePage } from '@/api/recipe'
import RecipeCardList from '@/components/recipe/recipe-card-list.vue'
import { getRecipeMenuPage } from '@/api/recipe-menu'

const router = useRouter()
const tabActive = ref('recipe') // 当前活动tab
const searchContent = ref('') // 查询的内容

/**
 * 取消
 */
function cancel() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}
</script>

<template>
  <!-- 搜索框 -->
  <van-cell-group inset>
    <van-field
      v-model="searchContent"
      left-icon="search"
      placeholder="想找什么，请输入"
      :border="false"
      :clearable="false"
    >
      <template #button>
        <van-button
          plain size="mini" type="primary" @click="cancel"
        >
          取消
        </van-button>
      </template>
    </van-field>
  </van-cell-group>
  <van-tabs
    v-model:active="tabActive"
    animated swipeable sticky
    background="transparent"
  >
    <van-tab name="recipe">
      <template #title>
        菜谱
      </template>
      <RecipeCardList
        :recipe-list-api="getRecipePage"
        :query-param="{
          name: searchContent,
        }"
        min-height="80vh"
        :is-auto-query="false"
      />
    </van-tab>
    <van-tab name="menu">
      <template #title>
        菜单
      </template>
      <RecipeMenuCardList
        :menu-list-api="getRecipeMenuPage"
        :query-param="{
          title: searchContent,
        }"
        min-height="80vh"
      />
    </van-tab>
  </van-tabs>
</template>

<route lang="json5">
{
  name: 'Search',
  meta: {
    title: '菜谱查询',
    i18n: 'menus.home',
    customNav: true,
  },
}
</route>
