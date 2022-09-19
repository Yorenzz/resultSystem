<script setup>
import {
  ref,
  computed,
  watch,
  reactive,
} from 'vue'
import { useClassStore } from '../store/classMessage.js'
import {
  CLASS_TRANSLATE,
  CLASS_TRANSLATE_REVERSE,
  SUBJECT_TRANSLATE,
} from '../constant/index.js'
import { advantageResult } from '../api/index.js'
const checkedGrade = ref(1)

const store = useClassStore()
const checkAll = ref(false)
const isIndeterminate = ref(true)
const checkedClass = ref(null)
const resultAdv = ref([])
const resultNextAdv = ref([])

const loading = reactive({
  table: false,
})

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

handleCheckAllChange()

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
getAdvantageResult(
  checkedGrade.value,
  checkedClass.value,
)
getAdvantageResult(
  checkedGrade.value,
  checkedClass.value,
  2,
)
watch(
  () => checkedGrade.value,
  val => {
    getAdvantageResult(val, classFormat.value)
    getAdvantageResult(val, checkedClass.value, 2)
  },
)
watch(
  () => classFormat.value,
  val => {
    getAdvantageResult(checkedGrade.value, val)
    getAdvantageResult(checkedGrade.value, val, 2)
  },
)
</script>

<template>
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
</template>

<style scoped lang="scss">
.advantage-content {
  padding: 32px;
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
</style>
