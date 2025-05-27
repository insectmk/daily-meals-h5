/**
 * 将数组转为vant tree list所需的格式
 * @param data
 */
export function convertToVantTree(data) {
  const options = {
    idKey: 'id', // 原始数据ID字段名
    parentIdKey: 'parentId', // 父节点字段名
    textKey: 'name', // 文本字段映射（对应Vant的text）
    childrenKey: 'children', // 子节点字段名
  }

  const nodeMap = new Map()
  const tree = []

  // 创建映射表并初始化节点结构
  data.forEach((item) => {
    nodeMap.set(item[options.idKey], {
      text: item[options.textKey],
      ...item, // 保留原始属性（如id、disabled等）
      [options.childrenKey]: [], // 初始化子节点
    })
  })

  // 构建树形结构
  data.forEach((item) => {
    const node = nodeMap.get(item[options.idKey])
    const parentId = item[options.parentIdKey]

    if (parentId === null || parentId === 0) {
      tree.push(node) // 根节点处理
    }
    else if (nodeMap.has(parentId)) {
      nodeMap.get(parentId)[options.childrenKey].push(node) // 子节点挂载
    }
  })

  return tree
}
