### 合并单元格

:::demo

```html
<template>
  <div>
    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="id" label="ID" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名"> </el-table-column>
      <el-table-column prop="amount1" label="数值 1（元）"> </el-table-column>
      <el-table-column prop="amount2" label="数值 2（元）"> </el-table-column>
      <el-table-column prop="amount3" label="数值 3（元）"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [
          {
            id: '12987122',
            name: '王小虎1',
            amount1: '234',
            amount2: '3.2',
            amount3: 10
          },
          {
            id: '12987122',
            name: '王小虎1',
            amount1: '165',
            amount2: '4.43',
            amount3: 12
          },
          {
            id: '12987122',
            name: '王小虎2',
            amount1: '324',
            amount2: '1.9',
            amount3: 9
          },
          {
            id: '12987122',
            name: '王小虎2',
            amount1: '621',
            amount2: '2.2',
            amount3: 17
          },
          {
            id: '12987126',
            name: '王小虎3',
            amount1: '539',
            amount2: '4.1',
            amount3: 15
          }
        ]
      }
    },

    methods: {
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (rowIndex % 2 === 0) {
          if (columnIndex === 0) {
            return [1, 2]
          } else if (columnIndex === 1) {
            return [0, 0]
          }
        }
      },

      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        // if (columnIndex === 0) {
        //   if (rowIndex % 2 === 0) {
        //     return {
        //       rowspan: 2,
        //       colspan: 1
        //     };
        //   } else {
        //     return {
        //       rowspan: 0,
        //       colspan: 0
        //     };
        //   }
        // }

        if (!['id', 'name'].includes(column.property)) {
          return {
            rowspan: 1,
            colspan: 1
          }
        }

        const rowspan = getRowSpan(this.tableData, column.property, rowIndex)

        return {
          rowspan,
          colspan: rowspan === 0 ? 0 : 1
        }
      }
    }
  }

  const spanMap = {}

  function getSpan(tableData, prop, rowIndex) {}

  function getRowSpan(tableData, prop, rowIndex) {
    if (!Array.isArray(spanMap[prop])) {
      spanMap[prop] = []
    }

    const list = spanMap[prop]

    if (!list[rowIndex] && list[rowIndex] !== 0) {
      list[rowIndex] = calcRowSpan(tableData, prop, list, rowIndex)
    }

    return list[rowIndex]
  }

  function calcRowSpan(tableData, prop, list, rowIndex) {
    let count = 0
    while (rowIndex < tableData.length) {
      const cur = tableData[rowIndex][prop]
      const next = (tableData[rowIndex + 1] || {})[prop]

      count++

      if (cur !== next) {
        list[rowIndex - count - 1] = count
        return count
      }

      list[++rowIndex] = 0
    }
  }
</script>
```

:::
