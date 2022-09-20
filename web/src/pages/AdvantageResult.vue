<script setup>
import {
  ref,
  computed,
  watch,
  reactive,
  onMounted,
  watchEffect,
} from 'vue'
import { useClassStore } from '../store/classMessage.js'
import {
  CLASS_TRANSLATE,
  CLASS_TRANSLATE_REVERSE,
  SUBJECT_TRANSLATE,
  GRADE_SUBJECT,
} from '../constant/index.js'
import {
  advantageResult,
  advantageResultByGrade,
} from '../api/index.js'
import * as echarts from 'echarts/core'
import '../common/echartsUse.js'

const checkedGrade = ref(1)

const store = useClassStore()
const checkAll = ref(false)
const isIndeterminate = ref(true)
const checkedClass = ref(null)
const resultAdv = ref([])
const resultNextAdv = ref([])
const gradeAdv = ref([])
let myChart = null
const loading = reactive({
  table: false,
  chart: false,
})
const chartRef = ref(null)

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
  return GRADE_SUBJECT[checkedGrade.value].map(
    item => {
      return SUBJECT_TRANSLATE[item]
    },
  )
})

const chartData = computed(() => {
  return gradeAdv.value.map(
    (perClassValue, index) => {
      const perCLassAdv = perClassValue.map(
        perSubject => {
          return perSubject[
            Object.keys(perSubject)[0]
          ]
        },
      )
      return {
        name: CLASS_TRANSLATE[index + 1],
        type: 'bar',
        data: perCLassAdv,
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
  checkAll.value =
    checkedCount === perClass.value.length
  isIndeterminate.value =
    checkedCount > 0 &&
    checkedCount < perClass.value.length
}

const getAdvantageResult = (
  grade,
  Class,
  testTime,
) => {
  loading.table = true
  advantageResult(grade, Class, testTime)
    .then(res => {
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
    })
    .catch(err => {
      console.warn(err)
    })
    .finally(() => {
      loading.chart = false
    })
}

const option = computed(() => ({
  title: {
    text: '各班平均分柱状图',
  },
  tooltip: {},
  xAxis: {
    data: chartAxisData.value,
  },
  yAxis: {},
  series: chartData.value,
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
  myChart = echarts.init(chartRef.value)
  myChart.setOption(option.value, true)
})

watch(
  () => checkedGrade.value,
  val => {
    getPerAdvantage(val)
    getAdvantageResult(val, classFormat.value)
    getAdvantageResult(val, classFormat.value, 2)
  },
  {
    immediate: true,
  },
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
    myChart.setOption(option.value, true)
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
    <div
      class="advantage-chart"
      id="main"
      ref="chartRef"
      v-loading="loading.chart"
    >
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
  .advantage-chart {
    margin-top: 64px;
    height: 500px;
    width: 100%;
  }
}
</style>
