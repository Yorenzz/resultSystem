<script setup>
import { getTestTime } from '../../api/index.js'
import { ref } from 'vue'

const testType = ref([])
const today = ref(new Date())

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

const testTimeMes = () => {
	getTestTime()
		.then(res => {
			testType.value = res
		})
		.catch(e => {
			console.warn(e)
		})
}
testTimeMes()
</script>

<template>
  <div class="time">
    <div>
      <div>
        当前考试类型：
        {{ testType[0]?.['TestName'] || '--' }}
      </div>
      <div>当前学年所有考试类型</div>
    </div>
    <div class="calendar-content">
      <el-calendar>
        <template #dateCell="{ data }">
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
  justify-content: center;
  align-items: center;
  .calendar-content {
    width: 50%;
    margin-left: auto;
  }
}
</style>
