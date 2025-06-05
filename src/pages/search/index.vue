<script setup lang="ts">
import { useRouter } from 'vue-router'
import { getRecipePage } from '@/api/recipe'
import RecipeCardList from '@/components/recipe/recipe-card-list.vue'
import { getRecipeMenuPage } from '@/api/recipe-menu'
import type { RecipeCardListExposed } from '@/components/recipe/recipe-card-list.type'
import type { RecipeMenuCardListExposed } from '@/components/recipe-menu/recipe-menu-card-list.type'
import UserQueryList from '@/pages/search/tabs/user-query-list.vue'
import type { UserQueryListExposed } from '@/pages/search/tabs/user-query-list.type'

defineOptions({
  name: 'Search',
})

const router = useRouter()
const tabActive = ref('recipe') // 当前活动tab
const searchContent = ref('') // 查询的内容
const recipeCardList = ref<RecipeCardListExposed>() // 菜谱按名称查询列表
const recipeCardListByFood = ref<RecipeCardListExposed>() // 菜谱按食材查询列表
const recipeMenuCardList = ref<RecipeMenuCardListExposed>() // 菜单按名称查询列表
const userQueryListCardListRef = ref<UserQueryListExposed>() // 菜单按名称查询列表

/**
 * 取消
 */
function cancel() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}

/**
 * 搜素框回车处理
 */
function enterHandler() {
  switch (tabActive.value) {
    case 'recipe': // 菜谱
      recipeCardList.value.query() // 查询菜谱
      break
    case 'food': // 食材
      recipeCardListByFood.value.query() // 按照食材查询菜谱
      break
    case 'menu': // 菜单
      recipeMenuCardList.value.query() // 查询菜单
      break
    case 'user': // 用户
      userQueryListCardListRef.value.query() // 查询用户
      break
  }
}
</script>

<template>
  <!-- 搜索框 -->
  <van-sticky>
    <van-cell-group inset>
      <van-field
        v-model="searchContent"
        left-icon="search"
        placeholder="想找什么，请输入"
        :border="false"
        :clearable="false"
        @keydown.enter="enterHandler"
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
  </van-sticky>

  <van-tabs
    v-model:active="tabActive"
    animated swipeable
    background="transparent"
  >
    <van-tab name="recipe">
      <template #title>
        菜谱
      </template>
      <RecipeCardList
        ref="recipeCardList"
        :recipe-list-api="getRecipePage"
        :query-param="{
          name: searchContent,
        }"
        min-height="80vh"
        :is-auto-query="false"
      />
    </van-tab>
    <van-tab name="food">
      <template #title>
        食材
      </template>
      <RecipeCardList
        ref="recipeCardListByFood"
        :recipe-list-api="getRecipePage"
        :query-param="{
          foodNames: searchContent.trim().split(/[\s,，;；|]+/).filter(Boolean),
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
        ref="recipeMenuCardList"
        :menu-list-api="getRecipeMenuPage"
        :query-param="{
          title: searchContent,
        }"
        min-height="80vh"
        :is-auto-query="false"
      />
    </van-tab>
    <van-tab name="user">
      <template #title>
        用户
      </template>
      <UserQueryList
        ref="userQueryListCardListRef"
        :nickname="searchContent"
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
    keepAlive: true,
  },
}
</route>
