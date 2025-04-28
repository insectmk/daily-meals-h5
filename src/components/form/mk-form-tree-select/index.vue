<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import type { PropType } from 'vue'
import TreeSelect from './tree.vue'
import type { CommonResult } from '@/api/type'
import { handleTree } from '@/utils/tree'

// 类型定义
interface TreeItem {
  [key: string]: any
  children?: TreeItem[]
  isHide?: boolean
  isShowChildren?: boolean
  checked?: boolean
}

interface ListObj {
  [key: string | number]: TreeItem
}

interface ComponentData {
  treeParam: string
  treeParamAlready: string
  list: TreeItem[]
  listObj: ListObj
  selectList: TreeItem[]
  searchSomeDataList: TreeItem[]
  canCheckList: TreeItem[]
  canCheckListFixed: TreeItem[]
  allSelect: boolean
  state: string
  names: string
}

// 定义 props
const props = defineProps({
  modelValue: {
    type: [Number, Array] as PropType<number | number[]>,
    required: true,
  },
  treeOptions: {
    type: Function as PropType<() => Promise<CommonResult<TreeItem[]>>>,
    required: true,
  },
  labelKey: {
    type: String,
    default: 'name',
  },
  idKey: {
    type: String,
    default: 'id',
  },
  pidKey: {
    type: String,
    default: 'pid',
  },
  isLink: {
    type: Boolean,
    default: true,
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  listData: { // 修复 watch 中使用的未声明 prop
    type: Array as PropType<TreeItem[]>,
    default: () => [],
  },
})

// 定义 emits
const emits = defineEmits<{
  (e: 'update:modelValue', value: number | number[]): void
  (e: 'change', value: TreeItem[]): void
  (e: 'confirm', value: TreeItem[]): void
}>()

// 响应式数据
const data = reactive<ComponentData>({
  treeParam: '',
  treeParamAlready: '',
  list: [],
  listObj: {},
  selectList: [],
  searchSomeDataList: [],
  canCheckList: [],
  canCheckListFixed: [],
  allSelect: false,
  state: '0',
  names: '',
})

const treeSelectRef = ref<InstanceType<typeof TreeSelect> | null>(null)
const sendWordShow = ref(false)

// 初始化树数据
props.treeOptions().then((res) => {
  data.list = handleTree(res.data) as TreeItem[]
})

// 方法实现
function init(type?: boolean): void {
  if (type) {
    data.names = ''
  }
  data.treeParam = ''
  data.treeParamAlready = ''
  data.canCheckList = []
  data.canCheckListFixed = []
}

function initData(options: TreeItem[]): void {
  if (options?.length) {
    data.list = options
    init()
    data.listObj = setListObj(options)
  }
}

function setListObj(list: TreeItem[], pid?: string | number): ListObj {
  let listObj: ListObj = {}
  list.forEach((itm) => {
    if (pid !== undefined) {
      itm[props.pidKey] = pid
    }
    data.canCheckList.push(itm)
    data.canCheckListFixed.push(itm)
    listObj[itm[props.idKey]] = itm
    if (itm.children?.length) {
      listObj = {
        ...listObj,
        ...setListObj(itm.children, itm[props.idKey]),
      }
    }
  })
  return listObj
}

function handleConfirm(): void {
  const showSelectList = filterData(data.selectList)
  emits('update:modelValue', showSelectList.map(itm => itm[props.idKey]))
  emits('confirm', showSelectList)
  sendWordShow.value = false
}

function onConfirm(e: TreeItem[]): void {
  emits('update:modelValue', e.map(itm => itm[props.idKey]))
  emits('confirm', e)
  sendWordShow.value = false
}

function filterData(selectList: TreeItem[]): TreeItem[] {
  data.allSelect = data.canCheckList.length
    === selectList.filter(itm => itm[props.labelKey].includes(data.treeParamAlready)).length
  return selectList.filter(itm => !itm.isHide && !itm.isShowChildren)
}

function checkChange(selectList: TreeItem[]): void {
  data.selectList = selectList
  emits('change', filterData(selectList))
}

function searchTreeByParam(): void {
  data.treeParamAlready = data.treeParam
  treeSelectRef.value?.outDataBuffer()

  const someDataList: TreeItem[] = []
  const someDataCanCheckList: TreeItem[] = []

  Object.keys(data.listObj).forEach((id) => {
    const item = data.listObj[id]
    if (data.treeParam) {
      item.isHide = true
      item.isShowChildren = false
      if (item[props.labelKey].includes(data.treeParam) || item.checked) {
        item.isHide = false
        someDataList.push(item)
        someDataCanCheckList.push(item)
      }
    }
    else {
      item.isHide = false
    }
  })

  data.searchSomeDataList = someDataList
  data.canCheckList = someDataCanCheckList.length
    ? someDataCanCheckList
    : deepClone(data.canCheckListFixed)

  setShowData(someDataList)
  checkChange(data.selectList)
}

function setShowData(datas: TreeItem[], bool?: boolean): void {
  const d: TreeItem[] = []
  datas.forEach((itm) => {
    const pid = itm[props.pidKey]
    if (pid && data.listObj[pid]) {
      const parent = data.listObj[pid]
      if (!d.find(item => item[props.idKey] === parent[props.idKey])) {
        d.push(parent)
      }
      if (typeof bool === 'boolean') {
        parent.checked = bool
      }
      parent.isHide = false
      parent.isShowChildren = true
    }
  })
  if (d.length)
    setShowData(d, bool)
}

function toggleAllSelectData(bool: boolean): void {
  const selectData: TreeItem[] = []
  Object.keys(data.listObj).forEach((id) => {
    const item = data.listObj[id]
    item.isShowChildren = false
    if (item[props.labelKey].includes(data.treeParam)) {
      item.checked = bool
      item.isHide = false
      selectData.push(item)
    }
  })
  setShowData(selectData, bool)
}

function allSelectChange(): void {
  toggleAllSelectData(data.allSelect)
}

function deepClone<T>(obj: T): T {
  const type = Object.prototype.toString.call(obj)
  if (type === '[object Array]') {
    return (obj as any[]).map(item => deepClone(item)) as T
  }
  if (type === '[object Object]') {
    const newObj: any = {}
    Object.keys(obj as object).forEach((key) => {
      newObj[key] = deepClone((obj as any)[key])
    })
    return newObj
  }
  return obj
}

function setDefault(): void {
  const someDataList: TreeItem[] = []
  const someDataCanCheckList: TreeItem[] = []

  treeSelectRef.value?.outDataBuffer()
  Object.keys(data.listObj).forEach((id) => {
    const item = data.listObj[id]
    item.checked = false
    item.isShowChildren = false
    ;(props.modelValue as number[]).forEach((mid) => {
      if (item[props.idKey] === mid) {
        item.checked = true
        someDataList.push(item)
        someDataCanCheckList.push(item)
      }
    })
  })

  data.names = someDataList.map(item => item.name).join(',')
  data.searchSomeDataList = someDataList
  data.canCheckList = someDataCanCheckList.length
    ? someDataCanCheckList
    : deepClone(data.canCheckListFixed)

  setShowData(someDataList)
}

// Watchers
watch(() => props.listData, (newVal) => {
  initData(newVal)
}, { deep: true, immediate: true })

watch(() => props.modelValue, () => {
  setDefault()
}, { deep: true, immediate: true })

// 生命周期
onMounted(() => {
  nextTick(() => {
    setDefaultTime()
  })
})

function setDefaultTime(): void {
  if (props.listData.length === 0) {
    setTimeout(setDefaultTime, 100)
  }
  else {
    setDefault()
  }
}

function sendWordOpen(): void {
  sendWordShow.value = true
  if (props.multiple)
    setDefault()
}

defineExpose({
  init,
  setListObj,
  checkChange,
  searchTreeByParam,
  setShowData,
  toggleAllSelectData,
  allSelectChange,
  deepClone,
  setDefault,
})
</script>

<template>
  <van-field v-model="data.names" is-link readonly v-bind="$attrs" @click="sendWordOpen" />
  <van-popup v-model:show="sendWordShow" round position="bottom">
    <div class="tree-box">
      <van-search v-model="data.treeParam" label-align="left" show-action placeholder="请输入搜索关键词">
        <template #action>
          <div @click="searchTreeByParam">
            搜索
          </div>
        </template>
      </van-search>
      <div class="tree-container">
        <div class="tree-data">
          <TreeSelect
            ref="treeSelectRef" :label-key="props.labelKey" :id-key="props.idKey" :pid-key="props.pidKey"
            :is-link="props.isLink" :list="data.list" :list-obj="data.listObj" :tree-param-already="data.treeParamAlready"
            :multiple="props.multiple" :default-id="props.modelValue[0]" @change="checkChange"
            @confirm="onConfirm"
          />
        </div>
      </div>
    </div>

    <div class="tree-confirm">
      <van-button v-if="multiple" type="primary" block @click="handleConfirm">
        确定
      </van-button>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.tree-box {
  --van-search-content-background-color: #eeeeee;
  --van-search-content-background: #eeeeee;
}

.tree-container {
  width: 100%;
  padding: 32px 32px 0;
}

.tree-data {
  height: 60vh;
  overflow-y: auto;
}

.tree-btns {
  width: 100%;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
}

.tree-confirm {
  width: 100%;
  padding: 12px 32px;
}
</style>
