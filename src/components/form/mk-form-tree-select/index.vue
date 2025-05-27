<script setup lang="ts">
import type { PropType } from 'vue'
import ApiCacheKey from '@/stores/api-cache/api-cache-key'
import { useApiCacheStore } from '@/stores'
import { convertToVantTree } from '@/components/form/mk-form-tree-select/util'
import type { TreeSelectChild } from 'vant'
import type { TreeNode } from '@/utils/tree'

// 定义 props
const props = defineProps({
  // 绑定值
  modelValue: {
    type: Array as PropType<number[]>,
    required: true,
    validator: (value: unknown) =>
      Array.isArray(value) && value.every(i => typeof i === 'number'),
  },
  // 树形选项，接口
  treeOptions: {
    type: Object as PropType<ApiCacheKey>,
    required: true,
  },
  // 标签名
  label: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:modelValue',
])

const apiCacheKeyStore = useApiCacheStore()

const showPopup = ref<boolean>(false) // 选择弹窗
const itemList = ref([]) // 选项内容（未解析）
const treeList = ref([]) // 树形选择内容
const activeIndex = ref(0) // 活动的id
const selectedViewList = ref<TreeNode[]>([]) // 选择的显示内容

// 获取树形选择内容
apiCacheKeyStore.getApiCache(ApiCacheKey.MEALS_RECIPE_CATEGORY).then((res) => {
  itemList.value = res
  treeList.value = convertToVantTree(res)
  // 刷新选中数据详细列表
  flushSelectedViewList()
})

watch(() => props.modelValue, (newValue) => {
  // 判断新值与可选内容列表是否都有值
  if (newValue && treeList.value.length > 0) {
    flushSelectedViewList()
  }
})

/**
 * 选项点击处理
 */
function itemClickHandel(item: TreeSelectChild) {
  // 创建新数组副本以避免直接修改 prop
  const newValue = [...props.modelValue]
  const itemId = Number(item.id)
  // 查看是否选择已经选择过
  const index = newValue.indexOf(itemId)
  if (index > -1) {
    // 存在，删除
    newValue.splice(index, 1)
  }
  else {
    // 不存在，加入
    newValue.push(itemId)
  }
  // 触发父组件更新
  emit('update:modelValue', newValue)
}
/**
 * 刷新选中数据详细列表
 */
function flushSelectedViewList() {
  selectedViewList.value = [] // 清空
  // 重新装入内容
  props.modelValue.forEach((i) => {
    selectedViewList.value.push(itemList.value.find(item => item.id === i))
  })
}
/**
 * 标签关闭操作，删除对应的选项
 */
function tagCloseHandel(item: TreeNode) {
  // 创建新数组副本以避免直接修改 prop
  const newValue = [...props.modelValue]
  const index = newValue.indexOf(item.id)
  newValue.splice(index, 1) // 删除
  // 触发父组件更新
  emit('update:modelValue', newValue)
}
</script>

<template>
  <van-field
    autosize
    :label="label" label-align="left"
    right-icon="arrow"
    show-word-limit
    @click="showPopup = true"
  >
    <template #input>
      <div>
        <van-tag
          v-for="(item, index) in selectedViewList"
          :key="index"
          class="mr-4"
          type="primary"
          closeable plain
          @close="tagCloseHandel(item)"
        >
          {{ item.name }}
        </van-tag>
      </div>
    </template>
  </van-field>
  <van-popup
    v-model:show="showPopup"
    destroy-on-close position="bottom" :style="{ height: '40%' }"
  >
    <div class="van-picker__toolbar">
      <van-button
        type="primary" class="van-picker__cancel van-haptics-feedback"
        @click="showPopup = false"
      >
        取消
      </van-button>
      <van-button
        type="success" class="van-haptics-feedback van-picker__confirm"
        @click="showPopup = false"
      >
        确认
      </van-button>
    </div>
    <van-tree-select
      v-model:main-active-index="activeIndex"
      :active-id="modelValue"
      :items="treeList"
      @click-item="itemClickHandel"
    />
  </van-popup>
</template>

<style lang="scss" scoped>

</style>
