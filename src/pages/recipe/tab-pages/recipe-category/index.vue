<script setup lang="ts">
import { getRecipeCategoryList } from '@/api/recipecategory'
import type { TreeNode } from '@/utils/tree'
import { handleTree } from '@/utils/tree'
import { useRouter } from 'vue-router'

const active = ref<number>(0) // 当前活动的内容
const categoryTree = ref<TreeNode[]>([]) // 树形菜谱分类
const activeCategory = ref<TreeNode>({}) // 当前活动的菜谱分类
const router = useRouter()

// 定义滚动容器引用（根据样式类名定位）
const leftScrollRef = ref<HTMLElement>() // 左侧菜单滚动容器
const rightScrollRef = ref<HTMLElement>() // 右侧内容滚动容器

// 存储滚动位置
const scrollPositions = ref({
  left: 0,
  right: 0,
})

// 获取树形分类菜单
getRecipeCategoryList().then((res) => {
  // 菜谱分类
  categoryTree.value = handleTree(res.data)
  // 当前活动的菜谱分类
  activeCategory.value = categoryTree.value[0]
})

/**
 *  侧边菜单点击事件
 * @param treeRoot 点击的菜谱分类节点
 */
function sidebarClick(treeRoot: TreeNode) {
  // 当前活动的菜谱分类
  activeCategory.value = treeRoot
}

/**
 * 打开菜谱列表分类页面（根据菜谱分类过滤）
 * @param treeSecond 二次菜谱分类
 */
function openRecipeListByCategory(treeSecond: TreeNode) {
  router.push(`/recipe/tab-pages/recipe-category/${treeSecond.id}`)
}

// 路由离开前记录位置
onBeforeRouteLeave(() => {
  if (leftScrollRef.value) {
    scrollPositions.value.left = leftScrollRef.value.scrollTop
  }
  if (rightScrollRef.value) {
    scrollPositions.value.right = rightScrollRef.value.scrollTop
  }
})

// 组件激活时恢复位置
onActivated(() => {
  nextTick(() => {
    if (leftScrollRef.value) {
      leftScrollRef.value.scrollTop = scrollPositions.value.left
    }
    if (rightScrollRef.value) {
      rightScrollRef.value.scrollTop = scrollPositions.value.right
    }
  })
})
</script>

<template>
  <!-- 外层容器设置固定高度 -->
  <div class="container">
    <van-row class="flex-container">
      <!-- 左侧边栏区域（菜单根结点） -->
      <van-col :span="6" class="left-col">
        <div ref="leftScrollRef" class="scroll-wrapper">
          <van-sidebar v-model="active">
            <van-sidebar-item v-for="treeRoot in categoryTree" :key="treeRoot.id" :title="treeRoot.name" @click="sidebarClick(treeRoot)" />
          </van-sidebar>
        </div>
      </van-col>

      <!-- 右侧内容区域 -->
      <van-col :span="18" class="right-col">
        <div ref="rightScrollRef" class="scroll-wrapper">
          <van-grid column-num="3" :gutter="10">
            <van-grid-item
              v-for="treeSecond in activeCategory.children" :key="treeSecond.id"
              style="font-size: 0.8rem;font-weight: 500;"
              @click="openRecipeListByCategory(treeSecond)"
            >
              <span v-if="treeSecond.picUrl">
                <van-image
                  :src="treeSecond.picUrl"
                />
                {{ treeSecond.name }}
              </span>
              <span v-else>
                {{ treeSecond.name }}
              </span>
            </van-grid-item>
          </van-grid>
        </div>
      </van-col>
    </van-row>
  </div>
</template>

<style scoped>
/* 关键样式 */
.container {
  height: calc(100vh - 130px); /* 占据高度 */
  overflow: hidden; /* 禁止外部滚动 */
}

.flex-container {
  display: flex;
  height: 100%;
}

.left-col,
.right-col {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-wrapper {
  flex: 1;
  overflow-y: auto; /* 启用垂直滚动 */
  -webkit-overflow-scrolling: touch; /* 移动端流畅滚动 */
}

/* 优化滚动条样式（可选） */
.scroll-wrapper::-webkit-scrollbar {
  width: 4px;
  background-color: #f5f5f5;
}

.scroll-wrapper::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background-color: #c1c1c1;
}

/* 修复 Vant 组件样式冲突 */
.van-sidebar {
  width: 100%; /* 确保侧边栏占满容器 */
}

.van-grid {
  padding: 8px; /* 增加内容间距 */
}
</style>
