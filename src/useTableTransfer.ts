import { ref, watch, nextTick, Ref } from 'vue'

export interface UseTableTransferParams<T> {
  rowKey: keyof T
  tableRefLeft: Ref<any>
  tableDataLeft: Ref<T[]>
  tableDataRight: Ref<T[]>
}

export interface UseTableTransferReturns<T> {
  handleSelectionChange: (val: T[]) => void
  handleSelect: (selection: T[], row: T) => Promise<void>
  handleSelectAll: (val: T[]) => void
  handleDelete: (row: T) => void
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
