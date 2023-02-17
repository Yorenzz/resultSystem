<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useClassStore } from '../store/classMessage.js'
import { CLASS_TRANSLATE,
	CLASS_TRANSLATE_REVERSE,
	FULL_SCORE_RANGE,
	GRADE_SUBJECT,
	SUBJECT_TRANSLATE, TOTAL_SCORE_RANGE, SCORE_RANGE } from '../constant/index.js'
import { echartsInit } from '../common/echartsUse.js'
import { getScoreRange } from '../api/index.js'

const store = useClassStore()

const checkedGrade = ref(1)
const checkedClass = ref(null)
const checkedSubject = ref('Chinese')
const chartRef = ref()

let chart = null

const chartData = ref([])
const loading = reactive({ chart: false })

const xAxisData = computed(() => {
	switch (checkedSubject.value) {
	case 'Chinese':
		return FULL_SCORE_RANGE
	case 'Math':
		return FULL_SCORE_RANGE
	case 'English':
		return FULL_SCORE_RANGE
	case 'Total':
		return TOTAL_SCORE_RANGE
	default:
		return SCORE_RANGE
	}
})

const option = computed(() => {
	return {
		xAxis: {
			type: 'category',
			data: xAxisData.value,
		},
		yAxis: { type: 'value' },

		tooltip: {
			trigger: 'axis',
			axisPointer: { type: 'shadow' },
		},
		legend: {},
		series: chartData.value,
	}
})

const perNumClass = computed(() => {
	return store
		.getPerClass(checkedGrade.value).map(item => {
			return item.Class
		})
})

const perSubject = computed(() => {
	return GRADE_SUBJECT[checkedGrade.value]
})

const getRange = () => {
	const arr = []
	loading.chart = true
	Promise.all(perNumClass.value.map((item) => {
		arr.push({
			name: CLASS_TRANSLATE[item],
			data: null,
			type: 'bar',
			label: {
				show: true,
				position: 'top',
			},
		})

		return getScoreRange(checkedGrade.value, item, checkedSubject.value)
	})).then((res) => {
		res.map((item, index) => {
			arr[index].data = item
			return item
		})
		chartData.value = arr
	}).catch((err) => {
		console.warn(err)
	}).finally(() => {
		loading.chart = false
	})
}

const handleChange = () => {
	getRange()
}

getRange()
onMounted(() => {
	chart = echartsInit(chartRef.value)
	chart.setOption(option.value, true, true)
})

watch(
	() => option.value,
	val => {
		chart.setOption(option.value, true, true)
	},
	{
		immediate: false,
		deep: true,
	},
)
</script>

<template>
  <div class="range">
    <div class="left-content">
      <div class="grade-select">
        <el-radio-group
          v-model="checkedGrade"
          @change="handleChange"
        >
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
      <div class="select-content">
        <div class="checkbox-content">
          <el-radio-group
            class="class-select"
            size="large"
            v-model="checkedSubject"
            @change="handleChange"
          >
            <el-radio
              v-for="item in perSubject"
              :key="item"
              :label="item"
              size="large"
            >
              {{ SUBJECT_TRANSLATE[item] }}
            </el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="right-content">
      <div
        ref="chartRef"
        class="chart"
        v-loading="loading.chart"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.range {
  padding: 32px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 154px);
  .left-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    .select-content {
      flex: 1;
      min-width: 225px;
      .grade-select {
        margin-bottom: 16px;
      }
      .checkbox-content {
        display: flex;
        justify-content: space-between;
        .class-select {
        }
      }
    }
  }

  .right-content {
    width: 100%;
    flex: 6;
    .chart {
      height: 100%;
      width: 100%;
    }
  }

}
</style>
