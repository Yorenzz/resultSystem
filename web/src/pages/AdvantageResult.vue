<script setup>
import { ref,
	computed,
	watch,
	reactive,
	onMounted } from 'vue'
import { useClassStore } from '../store/classMessage.js'
import { CLASS_TRANSLATE,
	CLASS_TRANSLATE_REVERSE,
	SUBJECT_TRANSLATE,
	GRADE_SUBJECT,
	CLASS_MAP } from '../constant/index.js'
import { advantageResult,
	advantageResultByGrade } from '../api/index.js'
import * as echarts from 'echarts/core'
import { echartsInit } from '../common/echartsUse.js'

const checkedGrade = ref(1)

const store = useClassStore()
const checkAll = ref(false)
const isIndeterminate = ref(true)
const checkedClass = ref(null)
const resultAdv = ref([])
const resultNextAdv = ref([])
const gradeAdv = ref([])
let myChart = null
let totalChart = null
const loading = reactive({
	table: false,
	chart: false,
})
const chartRef = ref(null)
const totalChartRef = ref(null)

const perClass = computed(() => {
	return store
		.getPerClass(checkedGrade.value)
		.map(item => {
			return CLASS_TRANSLATE[item.Class]
		})
})

const classFormat = computed(() => {
	return checkedClass.value.map(item => {
		return CLASS_TRANSLATE_REVERSE[item]
	})
})

const chartAxisData = computed(() => {
	const arr = GRADE_SUBJECT[
		checkedGrade.value
	].map(item => {
		return SUBJECT_TRANSLATE[item]
	})
	arr.pop()
	return arr
})

const totalAdvData = ref([])

const chartData = computed(() => {
	totalAdvData.value = []
	return gradeAdv.value.map(
		(perClassValue, index) => {
			const perCLassAdv = perClassValue.map(
				perSubject => {
					return perSubject[
						Object.keys(perSubject)[0]
					]
				},
			)
			const total = perCLassAdv.pop()
			console.log(total)
			totalAdvData.value.push({
				name: perClass.value[index],
				type: 'bar',
				data: [total],
				// label: {
				// 	show: true,
				// 	position: 'top',
				// },
			})
			return {
				name: perClass.value[index],
				type: 'bar',
				data: perCLassAdv,
				// label: {
				// 	show: true,
				// 	position: 'top',
				// },
			}
		},
	)
})

const handleCheckAllChange = val => {
	checkedClass.value = val ? perClass.value : []
	isIndeterminate.value = false
}

const handleCheckedCitiesChange = value => {
	const checkedCount = value.length
	checkAll.value
    = checkedCount === perClass.value.length
	isIndeterminate.value
    = checkedCount > 0
    && checkedCount < perClass.value.length
}

const getAdvantageResult = (
	grade,
	Class,
	testTime,
) => {
	loading.table = true
	advantageResult(grade, Class, testTime)
		.then(res => {
			console.log(res)
			!testTime && (resultAdv.value = res)
			testTime && (resultNextAdv.value = res)
		})
		.catch(err => {
			console.warn(err)
		})
		.finally(() => {
			loading.table = false
		})
}

const getPerAdvantage = grade => {
	loading.chart = true
	advantageResultByGrade(grade)
		.then(res => {
			gradeAdv.value = res
			myChart.setOption(option.value, true)

			totalChart.setOption(
				totalOption.value,
				true,
			)
		})
		.catch(err => {
			console.warn(err)
		})
		.finally(() => {
			loading.chart = false
		})
}

const option = computed(() => ({
	title: { text: '各班平均分柱状图' },
	legend: {},
	tooltip: {},
	xAxis: { data: chartAxisData.value },
	yAxis: {},
	series: chartData.value,
}))

const totalOption = computed(() => ({
	title: {
		text: '总分',
		left: 0,
		top: 0,
	},
	legend: {},
	tooltip: {},
	xAxis: { data: ['总分'] },
	yAxis: {},
	series: totalAdvData.value,
}))

handleCheckAllChange()

getAdvantageResult(
	checkedGrade.value,
	checkedClass.value,
)
getAdvantageResult(
	checkedGrade.value,
	checkedClass.value,
	2,
)

onMounted(() => {
	myChart = echartsInit(chartRef.value)
	totalChart = echartsInit(totalChartRef.value)
})

watch(
	() => checkedGrade.value,
	val => {
		getPerAdvantage(val)
		getAdvantageResult(val, classFormat.value)
		getAdvantageResult(val, classFormat.value, 2)
	},
	{ immediate: true },
)
watch(
	() => classFormat.value,
	val => {
		getAdvantageResult(checkedGrade.value, val)
		getAdvantageResult(checkedGrade.value, val, 2)
	},
	{
		immediate: false,
		deep: true,
	},
)
watch(
	() => option.value,
	val => {
		myChart.setOption(option.value, true, true)
	},
	{
		immediate: false,
		deep: true,
	},
)
watch(
	() => totalOption.value,
	val => {
		totalChart.setOption(
			totalOption.value,
			true,
			true,
		)
	},
	{
		immediate: false,
		deep: true,
	},
)
</script>

<template>
  <div class="advantage">
    <div class="advantage-content">
      <div class="select-content">
        <div class="grade-select">
          <el-radio-group v-model="checkedGrade">
            <el-radio-button
              :label="1"
              size="large"
            >
              初一
            </el-radio-button>
            <el-radio-button
              :label="2"
              size="large"
            >
              初二
            </el-radio-button>
            <el-radio-button
              :label="3"
              size="large"
            >
              初三
            </el-radio-button>
          </el-radio-group>
        </div>

        <div class="checkbox-content">
          <div class="tips">
            *全选或全不选都为全级成绩
          </div>
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <el-checkbox-group
            class="class-select"
            v-model="checkedClass"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="item in perClass"
              :key="item"
              :label="item"
              size="large"
            >
              {{ item }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="result-content">
        <el-descriptions
          title="各科平均分"
          direction="vertical"
          :column="4"
          border
          class="advantage-content-score"
          v-loading="loading.table"
        >
          <template
            v-for="(item, index) in resultAdv"
            :key="index"
          >
            <el-descriptions-item
              :label="
                SUBJECT_TRANSLATE[
                  Object.keys(item)[0]
                ]
              "
            >
              {{
                item[Object.keys(item)[0]] || '--'
              }}
            </el-descriptions-item>
          </template>
        </el-descriptions>
        <el-descriptions
          title="各科平均分变动趋势"
          direction="vertical"
          :column="4"
          border
          class="advantage-content-trend"
        >
          <template
            v-for="(item, index) in resultNextAdv"
            :key="index"
          >
            <el-descriptions-item
              :label="
                SUBJECT_TRANSLATE[
                  Object.keys(item)[0]
                ]
              "
            >
              {{
                item[Object.keys(item)[0]] || '--'
              }}
            </el-descriptions-item>
          </template>
        </el-descriptions>
      </div>
    </div>
    <div class="chart">
      <div
        class="advantage-chart"
        id="main"
        ref="chartRef"
        v-loading="loading.chart"
      />
      <div
        class="total-adv-chart"
        id="total"
        ref="totalChartRef"
        v-loading="loading.chart"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.advantage {
  padding: 32px;
  .advantage-content {
    display: flex;
    .select-content {
      flex: 1;
      min-width: 225px;
      .grade-select {
        margin-bottom: 16px;
      }
      .checkbox-content {
        .tips {
          font-size: 8px;
          color: #7f7f7f;
          margin-bottom: 8px;
        }
        .class-select {
          display: flex;
          flex-direction: column;
        }
      }
    }
    .result-content {
      flex: 5;
      display: flex;
      .advantage-content-score {
        margin-right: 16px;
        flex: 1;
      }
      .advantage-content-trend {
        flex: 1;
      }
    }
  }
  .chart {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .advantage-chart {
      flex: 3;
      margin-top: 32px;
      height: 500px;
    }
    .total-adv-chart {
      flex: 1;
      margin-top: 32px;
      height: 500px;
    }
  }
}
</style>
