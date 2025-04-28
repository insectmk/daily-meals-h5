import { defineStore } from 'pinia'

import type { DictInfo } from '@/api/system/type'
import { getDictDataListByType } from '@/api/system'
import type { CommonResult } from '@/api/type'

export const useDictStore = defineStore('dictionary', () => {
  // 字典信息
  const dictMap: Map<string, DictInfo[]> = new Map()

  // 刷新字典信息
  const flushDictByType = async (type: string) => {
    const result: CommonResult<DictInfo[]> = await getDictDataListByType(type)
    dictMap.set(type, result.data)
  }

  // 获取字典信息
  const getDictByType = async (type: string): Promise<DictInfo[]> => {
    if (dictMap.has(type)) {
      return dictMap.get(type)
    }
    // 从服务器获取字典数据
    await flushDictByType(type)
    // 返回字典信息
    return dictMap.get(type)
  }

  // 获取字典显示的值
  const getDictLabelByValue = (type: string, value: string | number): string => {
    if (dictMap.has(type)) {
      const dictInfos: DictInfo[] = dictMap.get(type)
      const dictInfo = dictInfos.find(dictInfo => String(dictInfo.value) === String(value))
      if (dictInfo) {
        return dictInfo.label
      }
      return String(value)
    }
    return String(value)
  }

  // 异步获取字典显示的值
  const getDictLabelByValueAsync = async (type: string, value: string | number): string => {
    const dictInfos = await getDictByType(type)
    const dictInfo = dictInfos.find(dictInfo => String(dictInfo.value) === String(value))
    if (dictInfo) {
      return dictInfo.label
    }
    return String(value)
  }

  return {
    dictMap,
    flushDictByType,
    getDictByType,
    getDictLabelByValue,
    getDictLabelByValueAsync,
  }
}, {
  persist: true,
})

export default useDictStore
