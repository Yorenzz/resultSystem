<script setup>
import { computed, reactive, ref } from 'vue'
import { useClassStore } from '../store/classMessage.js'
import { CLASS_TRANSLATE,
	CLASS_TRANSLATE_REVERSE,
	SUBJECT_TRANSLATE,
	GRADE_SUBJECT } from '../constant/index.js'
import { getStatisticNumber, getEstScore } from '../api/index.js'

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
getStatistic()
getHighestResult()
getLowestResult()
const handleCancel = () => {
	checkedClass.value = null
}

const handleChange = () => {
	getStatistic()
	getHighestResult()
	getLowestResult()
}
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
            原有人数:
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
            实考人数:
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
            最高分:
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
                style="width: 90%"
              />
            </template>
            {{ highestScore }}
          </el-skeleton>
        </div>
        <div class="fl">
          <div class="no-wrap">
            最低分:
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
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      justify-items: center;
      align-items: center;
    }
  }
}

.fl {
  display: flex;
  align-items: center;
  width: 100%;
}

.ml-8 {
  margin-left: 8px;
}

.no-wrap {
  white-space: nowrap;
}

.w-90 {}
</style>
