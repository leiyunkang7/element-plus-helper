import { ref, watch, nextTick, Ref } from 'vue'

/**
 *  入参
 */
export interface UseTableTransferParams<T> {
  /**
   * 行数据的 Key,值唯一
   */
  rowKey: keyof T

  /**
   * 左侧table的ref引用
   */
  tableRefLeft: Ref<any>

  /**
   * 左侧table绑定的data
   */
  tableDataLeft: Ref<T[]>

  /**
   * 右侧table绑定的data
   */
  tableDataRight: Ref<T[]>
}

/**
 * 出参
 * 一系列加工之后的el-talbe事件
 * 具体清看 https://element-plus.org/#/zh-CN/component/table#table-events
 */
export interface UseTableTransferReturns<T> {
  /**
   * @selection-change 当选择项发生变化时会触发该事件
   */
  handleSelectionChange: (val: T[]) => void

  /**
   * 	@select 当用户手动勾选数据行的 Checkbox 时触发的事件
   */
  handleSelect: (selection: T[], row: T) => Promise<void>

  /**
   * @select-all 当用户手动勾选全选 Checkbox 时触发的事件
   */
  handleSelectAll: (val: T[]) => void

  /**
   * 右侧删除单个的回调
   */
  handleDelete: (row: T) => void

  /**
   * 右侧删除全部的回调
   */
  handleDeleteAll: () => void
}

export function useTableTransfer<T = Record<string, unknown>>({
  rowKey,
  tableRefLeft,
  tableDataLeft,
  tableDataRight
}: UseTableTransferParams<T>): UseTableTransferReturns<T> {
  const multipleSelection: Ref<T[]> = ref([])

  const isAddOrRemove = ref(true)

  function equal(row: T) {
    return (item: T) => item[rowKey] === row[rowKey]
  }

  watch(multipleSelection, (newVal, oldVal) => {
    isAddOrRemove.value = newVal.length > oldVal.length
  })

  function handleSelectionChange(val: T[]) {
    multipleSelection.value = val
  }

  async function handleSelect(selection: T[], row: T) {
    await nextTick()
    if (isAddOrRemove.value) {
      selectAdd(row)
    } else {
      selectRemove(row)
    }
  }

  async function handleSelectAll(selection: T[]) {
    const isAdd = selection.length !== 0

    if (isAdd) {
      selection.forEach((row) => selectAdd(row))
    } else {
      tableDataLeft.value.forEach((item) => selectRemove(item))
    }
  }

  function selectRemove(row: T) {
    const index = tableDataRight.value.findIndex(equal(row))
    index >= 0 && tableDataRight.value.splice(index, 1)
  }

  function selectAdd(row: T) {
    if (tableDataRight.value.length === 0) {
      tableDataRight.value.push(row)
    }

    const isExsit = tableDataRight.value.findIndex(equal(row)) >= 0

    if (!isExsit) {
      tableDataRight.value.push(row)
    }
  }

  function syncLeft(list: T[], addOrRemove: boolean) {
    list.forEach((item) => {
      const row = tableDataLeft.value.find(equal(item))
      row && tableRefLeft.value?.toggleRowSelection(row, addOrRemove)
    })
  }

  function handleDelete(row: T) {
    selectRemove(row)
    syncLeft([row], false)
  }

  function handleDeleteAll() {
    syncLeft(tableDataRight.value, false)
    tableDataRight.value = []
  }

  async function sync() {
    await nextTick()
    tableRefLeft.value?.clearSelection()
    syncLeft(tableDataRight.value, true)
  }

  watch(tableDataLeft, sync)

  return {
    handleSelectionChange,
    handleSelect,
    handleSelectAll,
    handleDelete,
    handleDeleteAll
  }
}
