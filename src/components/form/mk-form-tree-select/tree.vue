<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { PropType } from 'vue'

// 定义类型
interface TreeItem {
  [key: string]: any
  id?: string | number
  pid?: string | number
  children?: TreeItem[]
  isHide?: boolean
  isShowChildren?: boolean
  checked?: boolean
}

interface ListObj {
  [key: string | number]: TreeItem
}

// 定义 props
const props = defineProps({
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
  isFirstFloor: {
    type: Boolean,
    default: true,
  },
  list: {
    type: Array as PropType<TreeItem[]>,
    default: () => [],
  },
  listObj: {
    type: Object as PropType<ListObj>,
    default: () => ({}),
  },
  treeParamAlready: {
    type: String,
    default: '',
  },
  allSelect: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  defaultId: {
    type: [String, Number] as PropType<string | number | undefined>,
    default: undefined,
  },
})

// 定义 emits
const emits = defineEmits<{
  (e: 'change', value: TreeItem[]): void
  (e: 'confirm', value: TreeItem[]): void
}>()

// 响应式数据
const data = reactive<{
  firstLoad: boolean
  checkboxValue1: TreeItem[]
  showList: TreeItem[]
  isOutData: boolean
}>({
  firstLoad: true,
  checkboxValue1: [],
  showList: [],
  isOutData: true,
})

// 方法实现保持逻辑不变，添加类型声明
function itemClick(item: TreeItem): void {
  outDataBuffer()
  item.isShowChildren = !item.isShowChildren
}

function outDataBuffer(): void {
  data.isOutData = false
  setTimeout(() => {
    data.isOutData = true
  }, 500)
}

function getCheckData(list: TreeItem[]): TreeItem[] {
  let deptList: TreeItem[] = []
  list.forEach((itm) => {
    if (itm.checked) {
      deptList.push(itm)
    }
    if (itm.children?.length) {
      deptList = deptList.concat(getCheckData(itm.children))
    }
  })
  return deptList
}

function checkChange(item: TreeItem): void {
  if (props.multiple) {
    if (props.isLink) {
      if (item.checked) {
        expandAll(item)
      }
      checkParent(item)
      if (item.children?.length) {
        checkChildren(item.children, item.checked ?? false)
      }
    }
    return
  }

  if (item.children?.length)
    return
  toggleAllSelectData(props.list)
  item.checked = true
  outCheckedData()
}

function toggleAllSelectData(list: TreeItem[]): void {
  list.forEach((itm) => {
    itm.checked = false
    if (itm.children?.length) {
      toggleAllSelectData(itm.children)
    }
  })
}

function expandAll(item: TreeItem): void {
  if (item.children?.length) {
    item.isShowChildren = true
    item.children.forEach((itm) => {
      expandAll(itm)
    })
  }
}

function checkParent(item: TreeItem): void {
  const parent = props.listObj[item[props.pidKey]]
  if (!parent)
    return

  let someDataCount = 0
  let checkedDataCount = 0
  for (const id in props.listObj) {
    const itm = props.listObj[id]
    if (itm[props.pidKey] === parent[props.idKey] && !itm.isHide) {
      someDataCount++
      if (itm.checked) {
        checkedDataCount++
      }
    }
  }

  const isEqual = someDataCount === checkedDataCount
  if (parent.checked !== isEqual) {
    parent.checked = isEqual
    checkParent(parent)
  }
}

function checkChildren(children: TreeItem[], isChecked: boolean): void {
  children.forEach((itm) => {
    itm.checked = isChecked
    if (itm.children?.length) {
      checkChildren(itm.children, isChecked)
    }
  })
}

function outCheckedData(): void {
  const checkedList = getCheckData(props.list)
  emits('change', checkedList)
  onConfirm(checkedList)
}

function onConfirm(e: TreeItem[]): void {
  if (props.multiple)
    return
  if (e[0]?.children?.length)
    return
  emits('confirm', e)
}

// Watcher 保持不变，添加泛型参数
watch(() => props.list, (_newVal, _oldVal) => {
  if (data.firstLoad) {
    outDataBuffer()
    data.firstLoad = false
  }
  if (props.isFirstFloor && data.isOutData && props.multiple) {
    outCheckedData()
  }
}, { deep: true })

defineExpose({
  itemClick,
  outDataBuffer,
  getCheckData,
  checkChange,
  expandAll,
  checkParent,
  checkChildren,
  outCheckedData,
})
</script>

<template>
  <div class="list">
    <div v-for="item in props.list" v-show="!item.isHide" :key="item[idKey]" class="item">
      <div class="title">
        <div class="checkbox-box">
          <van-checkbox v-if="props.multiple" v-model="item.checked" icon-size="16px" shape="square" @click.stop="checkChange(item)">
            <span style="font-size: 15px;">{{ item[labelKey] }}</span>
          </van-checkbox>
          <p v-else :style="{ fontSize: '15px', color: defaultId === item[idKey] ? 'var(--van-primary-color)' : '' }" @click.stop="checkChange(item)">
            {{ item[labelKey] }}
          </p>
        </div>
        <div class="arrow" @click.stop="itemClick(item)">
          <van-icon v-if="item.children && item.children.length" :name="item.isShowChildren ? 'arrow-up' : 'arrow-down'" />
        </div>
      </div>
      <div v-show="item.isShowChildren" class="tree">
        <tree
          v-if="item.children && item.children.length" :label-key="props.labelKey" :id-key="props.idKey" :pid-key="props.pidKey"
          :is-link="props.isLink" :list="item.children" :list-obj="props.listObj"
          :is-first-floor="false" :multiple="props.multiple" :default-id="defaultId" @confirm="onConfirm"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list {
  .item {
    margin-bottom: 10px;

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;

      .checkbox-box {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 10px 0;
      }

      .arrow {
        width: 80px;
        display: flex;
        justify-content: flex-end;
      }
    }

    .tree {
      margin-left: 50px;
    }
  }
}
</style>
