<script setup>
import { computed, reactive, ref } from 'vue'
import { useClassStore } from '../store/classMessage.js'
import { CLASS_TRANSLATE,
	CLASS_TRANSLATE_REVERSE,
	SUBJECT_TRANSLATE,
	GRADE_SUBJECT } from '../constant/index.js'
import { getStatisticNumber } from '../api/index.js'

const store = useClassStore()

const loading = reactive({ table: false })

const checkedGrade = ref(1)
const checkedClass = ref(null)
const checkedSubject = ref('Chinese')

const initialNumber = ref()
const actualNumber = ref()

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
	getStatisticNumber(checkedGrade.value, classFormat.value, checkedSubject.value).then((res) => {
		console.log(res)
		initialNumber.value = res.initialNumber
		actualNumber.value = res.actualNumber
	})
}
getStatistic()
const handleCancel = () => {
	checkedClass.value = null
}
</script>

<template>
  <div class="rank">
    <div class="left-content">
      <div class="select-content">
        <div class="grade-select">
          <el-radio-group
            v-model="checkedGrade"
            @change="getStatistic"
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
            @change="getStatistic"
          >
            <el-button
              link
              type="primary"
              @click="handleCancel"
            >
              取消选中班级
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
            @change="getStatistic"
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
        <div>原有人数:{{ initialNumber }}</div>
        <div>实考人数:{{ actualNumber }}</div>
        <div>平均分:</div>
        <div>最高分:</div>
        <div>最低分:</div>
      </div>
      <div class="statistic-chart">
        优秀人数
        优秀率
        及格人数
        及格率
        不及格人数
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
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
}
</style>
