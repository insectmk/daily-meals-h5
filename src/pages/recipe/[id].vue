<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { getRecipeInfo } from '@/api/recipe'
import type { RecipeInfo } from '@/api/recipe/type'
import ActionFuncBar from '@/pages/recipe/action-func-bar/index.vue'
import MorePopup from './more-popup/index.vue'
import RecipeComment from '@/pages/recipe/recipe-comment/index.vue'
import { showImagePreview } from 'vant'
import { formatDate } from '@vueuse/core'
import { addToDefaultCollect, cancelUserFavor } from '@/api/user-favor'
import { ContentTypesEnum } from '@/api/user-collect/enums'
import ResponseCode from '@/constants/response-code'

const route = useRoute()
const router = useRouter()

const id = Number((route.params as { id: number }).id) // 路由参数：菜谱ID
const recipe = ref<RecipeInfo>()
const loading = ref<boolean>(true) // 加载中
const showMoreOperator = ref<boolean>(false) // 展示更多操作的弹窗

/**
 * 获取菜谱信息
 */
getRecipeInfo({ id }).then((res) => {
  recipe.value = res.data
  loading.value = false // 加载完毕
})

/**
 * 返回操作
 */
function onBack() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}

/**
 * 菜谱内容点击
 */
function handleContentClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  const urls = extractImageUrls(recipe.value.recipeStep) // 提取所有图片的数组

  // 判断点击的是否为图片
  if (target.tagName === 'IMG') {
    const imgSrc = (target as HTMLImageElement).src
    showImagePreview({
      images: urls,
      startPosition: urls.indexOf(imgSrc),
    })
  }
}

/**
 * 解析图片url
 * @param html
 */
function extractImageUrls(html: string): string[] {
  // 改进正则：支持单引号和双引号，优化属性匹配
  const imgRegex = /<img[^>]+src\s*=\s*['"]([^'">]+)['"][^>]*>/gi
  const urls: string[] = []
  let match: RegExpExecArray | null

  // 优化循环：避免无限循环风险
  // eslint-disable-next-line no-cond-assign
  while ((match = imgRegex.exec(html)) !== null) {
    // 确保捕获组有效且非空
    if (match[1] && match[1].trim()) {
      urls.push(match[1].trim())
    }
  }
  return urls
}

/**
 * 关注用户处理
 */
function followUserHandler() {
  if (recipe.value.userFavor) {
    // 取消关注
    cancelUserFavor({
      contentId: recipe.value.userId, // 内容编号
      contentType: ContentTypesEnum.USER, // 内容类型
    }).then((res) => {
      if (res.code === ResponseCode.SUCCESS.code) {
        recipe.value.userFavor = false // 已取消关注
        showToast('已取消关注')
      }
    })
  }
  else {
    // 关注
    addToDefaultCollect({
      contentId: recipe.value.userId, // 内容编号
      contentType: ContentTypesEnum.USER, // 内容类型
    }).then((res) => {
      if (res.code === ResponseCode.SUCCESS.code) {
        recipe.value.userFavor = true // 已关注
        showToast(`已关注`)
      }
    })
  }
}
</script>

<template>
  <van-nav-bar
    title="菜谱信息"
    :left-text="$t('common.back')"
    left-arrow placeholder fixed
    @click-left="onBack"
  >
    <template #right>
      <van-icon name="ellipsis" size="24" @click="showMoreOperator = true" />
    </template>
  </van-nav-bar>
  <div v-if="loading">
    <van-loading size="24px">
      加载中...
    </van-loading>
  </div>
  <div v-else>
    <van-swipe :autoplay="3000" indicator-color="white">
      <van-swipe-item
        v-for="sliderPicUrl in recipe.sliderPicUrls"
        :key="sliderPicUrl"
        @click="() => showImagePreview({
          images: recipe.sliderPicUrls,
          startPosition: recipe.sliderPicUrls.indexOf(sliderPicUrl),
        })"
      >
        <van-image
          width="100%"
          fit="fill"
          :src="sliderPicUrl"
        />
      </van-swipe-item>
    </van-swipe>
    <van-row v-if="recipe.userNickname" class="mt-15">
      <van-col :span="5">
        <van-image
          round
          width="3.5rem"
          height="3.5rem"
          fit="cover"
          :src="recipe.userAvatar"
        />
      </van-col>
      <van-col :span="19" class="relative">
        <span>
          <span class="text-[18px] font-500">{{ recipe.userNickname }}</span><br>
          <span class="mt-[10px] flex text-[14px]">{{ formatDate(new Date(recipe.createTime), 'YYYY/MM/DD HH:mm') }}</span>
        </span>
        <span v-if="!recipe.selfRecipe" class="absolute right-0 top-[15px] text-[12px]">
          <van-tag
            plain
            type="primary"
            size="large"
            @click.stop="followUserHandler"
          >{{ recipe.userFavor ? '已关注' : '关注' }}</van-tag>
        </span>
      </van-col>
    </van-row>
    <van-divider
      :style="{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)', padding: '0 16px' }"
    >
      食材
    </van-divider>
    <van-row>
      <van-col
        v-for="food in recipe.foods"
        :key="food.id" :span="12"
      >
        {{ `${food.foodName}:${food.amount}${food.foodUnit}` }}
      </van-col>
    </van-row>
    <van-divider
      :style="{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)', padding: '0 16px' }"
    >
      步骤
    </van-divider>
    <div class="recipe-step-container mb-[20px]" @click="handleContentClick" v-html="recipe.recipeStep" />
    <!--  评论  -->
    <RecipeComment :recipe-id="recipe.id" />
    <!--  动作栏  -->
    <ActionFuncBar :recipe="recipe" />
    <!-- 更多操作弹窗 -->
    <MorePopup v-model:show="showMoreOperator" :recipe="recipe" />
  </div>
</template>

<style scoped>
/* 为所有通过v-html渲染的图片添加约束 */
.recipe-step-container :deep(img) {
  max-width: 100%; /* 限制最大宽度为容器宽度 */
  height: auto; /* 高度按比例自适应 */
  display: block; /* 消除图片底部间隙 */
  margin: 10px auto; /* 居中显示 */
  object-fit: contain; /* 完整显示图片（防止裁剪） */
}
</style>

<route lang="json5">
{
  name: 'RecipeInfo',
  meta: {
    title: '菜谱信息',
    i18n: 'recipe.info.title',
    keepAlive: true,
    customNav: true,
  },
}
</route>
