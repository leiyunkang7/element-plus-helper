# element-plus-helper

element-plus 辅助组合函数

## 安装

```
npm i element-plus-helper
or
yarn add element-plus-helper
```

## useTableTransfer 表格穿梭

<img alt="preview" src="https://cdn.jsdelivr.net/gh/leiyunkang7/vue-virtual-layout/preview-v1.gif" style="width:375px;height:667px;" />

### 用例:

```ts
<template>
  <h2>element-plus</h2>
  <div class="container">
    <div class="left">
      <el-table
        ref="tableRefLeft"
        :data="tableDataLeft"
        tooltip-effect="dark"
        style="width: 45%"
        @selection-change="handleSelectionChange"
        @select="handleSelect"
        @select-all="handleSelectAll"
        :row-key="rowKey"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="日期" width="120">
          <template #default="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="address" label="地址" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :total="20"
        :page-size="10"
        v-model:current-page="currentPage"
      >
      </el-pagination>
    </div>

    <el-table
      ref="multipleTableRight"
      :data="tableDataRight"
      tooltip-effect="dark"
      style="width: 45%"
      :row-key="rowKey"
    >
      <el-table-column label="日期" width="120">
        <template #default="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120"> </el-table-column>
      <el-table-column prop="address" label="地址" show-overflow-tooltip>
      </el-table-column>
      <el-table-column>
        <template #header>
          <i class="el-icon-delete" @click="handleDeleteAll()"></i>
        </template>
        <template #default="scope">
          <i class="el-icon-delete" @click="myHndleDelete(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTableTransfer } from 'element-plus-helper'

function getData(page: number) {
  let index = 0
  const data: User[] = []
  while (index < 10) {
    const id = index + page * 10
    data.push({
      id,
      date: `2016-05-0${id}`,
      name: `王小虎${id}`,
      address: '上海市普陀区金沙江路 1518 弄'
    })
    index++
  }
  return Promise.resolve(data)
}

interface User {
  id: number
  date: string
  name: string
  address: string
}

const rowKey = 'id'

const currentPage = ref(1)

const tableDataLeft = ref<User[]>([])

const tableDataRight = ref<User[]>([])

const tableRefLeft = ref()

const {
  handleSelectionChange,
  handleSelect,
  handleSelectAll,
  handleDelete,
  handleDeleteAll
} = useTableTransfer<User>({
  rowKey,
  tableRefLeft,
  tableDataLeft,
  tableDataRight
})

watch(
  currentPage,
  async (page) => {
    tableDataLeft.value = await getData(page)
  },
  {
    immediate: true
  }
)

function myHndleDelete(row: User) {
  handleDelete(row)
  // 如果有特殊的业务逻辑再包一层
}
</script>

```

### API:

#### 入参

```ts
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
```

#### 出参

```ts
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
```
