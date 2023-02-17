<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useClassStore } from '../store/classMessage.js'
import { CLASS_TRANSLATE,
	CLASS_TRANSLATE_REVERSE,
	SUBJECT_TRANSLATE,
	GRADE_SUBJECT } from '../constant/index.js'
import { getStatisticNumber, getEstScore, getGoodRate, getPassRate } from '../api/index.js'
import * as echarts from 'echarts/core'
import { echartsInit } from '../common/echartsUse.js'

const store = useClassStore()

const loading = reactive({
	table: false,
	statistic: false,
	highest: false,
	lowest: false,
})

const checkedGrade = ref(1)
const checkedClass = ref(null)
const checkedSubject = ref('Chinese')

const initialNumber = ref()
const actualNumber = ref()
const highestScore = ref()
const lowestScore = ref()
const goodNum = ref()
const goodRate = computed(() => {
	return actualNumber.value > 0 && goodNum.value > 0 ? ((goodNum.value / actualNumber.value) * 100).toFixed(2) : 0
})
const passNum = ref()
const passRate = computed(() => {
	return actualNumber.value > 0 && passNum.value > 0 ? ((passNum.value / actualNumber.value) * 100).toFixed(2) : 0
})
const noPassNum = computed(() => actualNumber.value - passNum.value)

const rateChartRef = ref()
let rateCharts = null

const option = computed(() => {
	return {
		title: {
			text: '优秀、及格情况统计',
			left: 'center',
			subtext: `优秀率：${goodRate.value}%\n\n及格率：${passRate.value}%`,
		},
		tooltip: { trigger: 'item' },
		legend: {
			orient: 'vertical',
			left: 'left',
		},
		series: [{
			type: 'pie',
			radius: '50%',
			data: [{ value: goodNum.value, name: '优秀人数' },
				{ value: (passNum.value - goodNum.value), name: '及格人数' },
				{ value: noPassNum.value, name: '不及格人数' }],
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)',
				},
			},
		}],
	}
})

const perClass = computed(() => {
	return store
		.getPerClass(checkedGrade.value)
		.map(item => {
			return CLASS_TRANSLATE[item.Class]
		})
})
const classFormat = computed(() => {
	return CLASS_TRANSLATE_REVERSE[checkedClass.value]
})
const perSubject = computed(() => {
	return GRADE_SUBJECT[checkedGrade.value]
})
const getStatistic = () => {
	loading.statistic = true
	getStatisticNumber(checkedGrade.value, classFormat.value, checkedSubject.value).then((res) => {
		console.log(res)
		loading.statistic = false
		initialNumber.value = res.initialNumber
		actualNumber.value = res.actualNumber
	})
}

const getHighestResult = () => {
	loading.highest = true
	getEstScore('high', checkedGrade.value, classFormat.value, checkedSubject.value).then((res) => {
		console.log('high', res)
		loading.highest = false
		highestScore.value = res.num
	})
}
const getLowestResult = () => {
	loading.lowest = true
	getEstScore('low', checkedGrade.value, classFormat.value, checkedSubject.value).then((res) => {
		console.log('low', res)
		loading.lowest = false
		lowestScore.value = res.num
	})
}

const getGood = () => {
	// loading.lowest = true
	getGoodRate(checkedGrade.value, classFormat.value, checkedSubject.value).then((res) => {
		console.log('l', res)
		// loading.lowest = false
		goodNum.value = res
	})
}

const getPass = () => {
	// loading.lowest = true
	getPassRate(checkedGrade.value, classFormat.value, checkedSubject.value).then((res) => {
		console.log('l', res)
		// loading.lowest = false
		passNum.value = res
	})
}

getStatistic()
getHighestResult()
getLowestResult()
getGood()
getPass()
const handleCancel = () => {
	checkedClass.value = null
	handleChange()
}

const handleChange = () => {
	getStatistic()
	getHighestResult()
	getLowestResult()
	getGood()
	getPass()
}

onMounted(() => {
	rateCharts = echartsInit(rateChartRef.value)
	rateCharts.setOption(option.value, true, true)
})

watch(
	() => option.value,
	val => {
		rateCharts.setOption(option.value, true, true)
	},
	{
		immediate: false,
		deep: true,
	},
)
</script>

<template>
  <div class="rank">
    <div class="left-content">
      <div class="select-content">
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

        <div class="checkbox-content">
          <el-radio-group
            class="class-select"
            v-model="checkedClass"
            @change="handleChange"
          >
            <el-button
              link
              type="primary"
              @click="handleCancel"
            >
              取消选中班级.
            </el-button>
            <el-radio
              v-for="item in perClass"
              :key="item"
              :label="item"
              size="large"
            >
              {{ item }}
            </el-radio>
          </el-radio-group>
          <el-radio-group
            class="class-select"
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
      <div class="statistic-data">
        <div class="fl">
          <div class="no-wrap">
            原有人数:&emsp;
          </div>
          <el-skeleton
            animated
            :loading="loading.statistic"
            :rows="0"
            class="fl ml-8"
          >
            <template #template>
              <el-skeleton-item
                variant="p"
                style="width: 90%"
              />
            </template>
            {{ initialNumber }}
          </el-skeleton>
        </div>
        <div class="fl">
          <div class="no-wrap">
            实考人数:&emsp;
          </div>
          <el-skeleton
            animated
            :loading="loading.statistic"
            :rows="0"
            class="fl ml-8"
          >
            <template #template>
              <el-skeleton-item
                variant="p"
                style="width: 90%"
              />
            </template>
            {{ actualNumber }}
          </el-skeleton>
        </div>
        <div class="fl">
          <div class="no-wrap">
            最高分:&emsp;
          </div>
          <el-skeleton
            animated
            :loading="loading.highest"
            :rows="0"
            class="fl ml-8"
          >
            <template #template>
              <el-skeleton-item
                variant="p"
                style="width: 80%"
              />
            </template>
            {{ highestScore }}
          </el-skeleton>
        </div>
        <div class="fl">
          <div class="no-wrap">
            最低分:&emsp;
          </div>
          <el-skeleton
            animated
            :loading="loading.lowest"
            :rows="0"
            class="fl ml-8"
          >
            <template #template>
              <el-skeleton-item
                variant="p"
                style="width: 90%"
              />
            </template>
            {{ lowestScore }}
          </el-skeleton>
        </div>
      </div>
      <div class="statistic-chart">
        <div
          ref="rateChartRef"
          class="rate"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rank {
  padding: 32px;
  display: flex;
  .left-content {
    display: flex;
    flex: 1;
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
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
      }
    }
  }
  .right-content {
    height: calc(100vh - 154px);
    flex: 6;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    row-gap: 24px;

    .statistic-data {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      justify-items: center;
      align-items: center;
    }

    .statistic-chart {
      margin-top: 16px;
      width: 100%;
      height: 100%;
      .rate {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.fl {
  display: flex;
  align-items: center;
  width: 100%;

  justify-content: center;
}

.ml-8 {
  margin-left: 8px;
}

.no-wrap {
  white-space: nowrap;
}

.w-90 {}
</style>
