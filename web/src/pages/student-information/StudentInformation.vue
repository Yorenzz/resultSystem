<script setup>
import { reactive, ref } from 'vue'
import { getStudentInformation } from '../../api'

const tableData = ref([])
const loading = reactive({
  table: false,
})
const studentTable = ref(null)
const column = [
  {
    field: 'StudentId',
    title: '编号',
    slots: {
      default: 'id',
    },
  },
  {
    field: 'Name',
    title: '名字',
    slots: {
      default: 'name',
    },
  },
  {
    field: 'Grade',
    title: '年级',
    slots: {
      default: 'grade',
    },
  },
  {
    field: 'Class',
    title: '班级',
    slots: {
      default: 'class',
    },
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
      <vxe-grid
        border
        align="center"
        :data="tableData"
        :columns="column"
        height="800px"
      >
        <template #id="{ row }">
          {{ row.StudentId }}
        </template>
        <template #name="{ row }">
          {{ row.Name }}
        </template>
        <template #grade="{ row }">
          {{ row.Grade }}
        </template>
        <template #class="{ row }">
          {{ row.Class }}
        </template>
      </vxe-grid>
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
