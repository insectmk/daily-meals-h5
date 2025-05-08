<script setup lang="ts">
import type { TreeNode } from '@/utils/tree'
import { handleTree } from '@/utils/tree'
import { useRouter } from 'vue-router'
import { getFoodCategoryList } from '@/api/foodcategory'

const active = ref<number>(0) // 当前活动的内容
const categoryTree = ref<TreeNode[]>([]) // 树形食材分类
const activeCategory = ref<TreeNode>({}) // 当前活动的食材分类
const router = useRouter()

// 获取树形分类菜单
getFoodCategoryList().then((res) => {
  // 食材分类
  categoryTree.value = handleTree(res.data)
  // 当前活动的食材分类
  activeCategory.value = categoryTree.value[0]
})

/**
 *  侧边菜单点击事件
 * @param treeRoot 点击的食材分类节点
 */
function sidebarClick(treeRoot: TreeNode) {
  // 当前活动的食材分类
  activeCategory.value = treeRoot
}

/**
 * 打开食材列表分类页面（根据食材分类过滤）
 * @param treeSecond 二次食材分类
 */
function openRecipeListByCategory(treeSecond: TreeNode) {
  router.push(`/recipe/tab-pages/food-category/${treeSecond.id}`)
}
</script>

<template>
  <!-- 外层容器设置固定高度 -->
  <div class="container">
    <van-row class="flex-container">
      <!-- 左侧边栏区域（菜单根结点） -->
      <van-col :span="6" class="left-col">
        <div class="scroll-wrapper">
          <van-sidebar v-model="active">
            <van-sidebar-item v-for="treeRoot in categoryTree" :key="treeRoot.id" :title="treeRoot.name" @click="sidebarClick(treeRoot)" />
          </van-sidebar>
        </div>
      </van-col>

      <!-- 右侧内容区域 -->
      <van-col :span="18" class="right-col">
        <div class="scroll-wrapper">
          <div v-for="treeSecond in activeCategory.children" :key="treeSecond.id">
            <van-divider
              :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
            >
              {{ treeSecond.name }}
            </van-divider>
            <van-grid column-num="3" :gutter="10">
              <van-grid-item
                v-for="treeThird in treeSecond.children" :key="treeThird.id"
                style="font-size: 0.8rem;font-weight: 500;"
                @click="openRecipeListByCategory(treeThird)"
              >
                <span v-if="treeThird.picUrl">
                  <van-image
                    :src="treeThird.picUrl"
                  />
                  {{ treeThird.name }}
                </span>
                <span v-else>
                  {{ treeThird.name }}
                </span>
              </van-grid-item>
            </van-grid>
          </div>
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
