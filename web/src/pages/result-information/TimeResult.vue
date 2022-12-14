<script setup>
import { getTestTime } from '../../api/index.js'
import { cloneDeep } from 'lodash'
import { ref } from 'vue'

const testType = ref([])
const tableTestType = ref([])
const calendar = ref()
const xTable = ref()

const isTestTime = day => {
	let testName = null
	testType.value?.map(item => {
		if (item?.TestDate === day) {
			testName = item?.TestName
		}
		return item
	})
	return testName
}

const selectDate = (val) => {
	calendar.value.selectDate(val)
}

const editRowEvent = (row) => {
	const $table = xTable.value
	$table.setEditRow(row)
}

const saveRowEvent = (row) => {
	const $table = xTable.value
	$table.clearEdit().then(() => {
	})
}

const cancelRowEvent = (row) => {
	const $table = xTable.value
	$table.clearEdit().then(() => {
		$table.revertData(row)
	})
}

const testTimeMes = () => {
	getTestTime()
		.then(res => {
			testType.value = res
			tableTestType.value = cloneDeep(res)
		})
		.catch(e => {
			console.warn(e)
		})
}
testTimeMes()
</script>

<template>
  <div class="time">
    <div class="test-table">
      <div class="title">
        当前学年所有考试类型
      </div>
      <vxe-table
        ref="xTable"
        keep-source
        :data="tableTestType"
        :column-config="{
          resizable: true
        }"
        :edit-config="{
          trigger: 'manual',
          mode: 'row',
          autoClear: false,
        }"
        align="center"
      >
        <vxe-column
          field="TestTime"
          title="编号"
        />
        <vxe-column
          field="TestName"
          title="考试类型"
          :edit-render="{}"
        >
          <template #edit="{ row }">
            <el-input
              v-model="row.TestName"
            />
          </template>
        </vxe-column>
        <vxe-column
          field="TestDate"
          title="考试时间"
          :edit-render="{}"
        >
          <template #edit="{ row }">
            <el-input
              v-model="row.TestDate"
            />
          </template>
        </vxe-column>
        <vxe-column
          title="操作"
        >
          <template #default="{ row }">
            <template v-if="xTable.isEditByRow(row)">
              <vxe-button @click="saveRowEvent(row)">
                保存
              </vxe-button>
              <vxe-button @click="cancelRowEvent(row)">
                取消
              </vxe-button>
            </template>
            <template v-else>
              <vxe-button @click="editRowEvent(row)">
                编辑
              </vxe-button>
            </template>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <div class="calendar-content">
      <el-calendar ref="calendar">
        <template #header>
          <span>
            最近一次考试类型：
            {{ testType[0]?.['TestName'] || '--' }}
          </span>
          <el-button-group>
            <el-button
              size="small"
              @click="selectDate('prev-month')"
            >
              上个月
            </el-button>
            <el-button
              size="small"
              @click="selectDate('today')"
            >
              今天
            </el-button>
            <el-button
              size="small"
              @click="selectDate('next-month')"
            >
              下个月
            </el-button>
          </el-button-group>
        </template>
        <template #date-cell="{ data }">
          <div>{{ +data.day.split('-').slice(2).join() }}</div>
          <div>{{ isTestTime(data.day) }}</div>
        </template>
      </el-calendar>
    </div>
  </div>
</template>

<style scoped lang="scss">
.time {
  padding: 16px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .test-table {
    width: 40%;
    .title {
      margin-bottom: 16px;
    }
  }
  .calendar-content {
    width: 50%;
  }
}
</style>
