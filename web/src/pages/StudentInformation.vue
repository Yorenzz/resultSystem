<script setup>
import { reactive, ref } from 'vue'
import { getStudentInformation } from '../api'

const tableData = ref([])
const loading = reactive({
  table: false,
})
const studentTable = ref(null)
const column = [
  {
    prop: 'StudentId',
    label: '编号',
  },
  {
    prop: 'Name',
    label: '名字',
  },
  {
    prop: 'Grade',
    label: '年级',
  },
  {
    prop: 'Class',
    label: '班级',
  },
]
const getInformation = () => {
  loading.table = true
  getStudentInformation()
    .then(res => {
      const { studentList } = res
      tableData.value = studentList
    })
    .catch(e => {
      console.warn(e)
    })
    .finally(() => {
      loading.table = false
    })
}
getInformation()
</script>

<template>
  <div class="student-content">
    <div class="table-content">
      <el-table
        ref="studentTable"
        :data="tableData"
        border
        stripe
        max-height="780px"
        v-loading="loading.table"
      >
        <template v-for="item in column">
          <el-table-column
            :prop="item.prop"
            :label="item.label"
          />
        </template>
      </el-table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.student-content {
  display: flex;
  .table-content {
    width: 500px;
    margin: 32px;
  }
}
</style>
