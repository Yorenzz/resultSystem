<script setup>
import { reactive, ref, watch, watchEffect } from 'vue'
import { studentResult } from '../api'
import StudentTree from '../components/StudentTree.vue'
import SubjectScore from '../components/SubjectScore.vue'
import {
  CLASS_TRANSLATE,
  GRADE_TRANSLATE,
} from '../constant/index.js'

const loading = reactive({
  result: false,
})

let scoreList = reactive({})
let perInformation = reactive({})

const selectID = ref(null)

const getResult = id => {
  studentResult(id).then(res => {
    console.log(res)
    const { result, information } = res
    scoreList = Object.assign(scoreList, result[0])
    perInformation = Object.assign(
      perInformation,
      information[0],
    )
  })
}

watchEffect(() => {
  if (selectID.value) {
    console.log('type', typeof selectID.value)
    getResult(selectID.value)
  }
})
</script>

<template>
  <div class="result-content">
    <StudentTree v-model:student="selectID" />
    <div class="right-content">
      <div class="title">
        {{ perInformation.Name }}
        {{ CLASS_TRANSLATE[perInformation.Class] }}
        {{ GRADE_TRANSLATE[perInformation.Grade] }}
      </div>
      <div v-if="selectID" class="result">
        <template v-for="(value, key) in scoreList">
          <SubjectScore
            :score="value"
            :subject="key"
            :msg="perInformation"
          />
        </template>
      </div>
      <div v-else class="result">
        请点击左侧选择学生查看学生成绩
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.result-content {
  display: flex;
  height: 100%;
  .right-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
    }
    .result {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
    }
  }
}
</style>
