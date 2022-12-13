<script setup>
import { reactive,
	ref,
	watch,
	watchEffect } from 'vue'
import { isEmpty } from 'lodash'
import { useRoute, useRouter } from 'vue-router'
import { studentResult } from '../api'
import StudentTree from '../components/StudentTree.vue'
import SubjectScore from '../components/SubjectScore.vue'
import { CLASS_TRANSLATE,
	GRADE_TRANSLATE } from '../constant/index.js'

const route = useRoute()
const router = useRouter()
const loading = reactive({ result: false })

const studentMessage = reactive({
	scoreList: {},
	information: {},
})

const selectID = ref(null)

const getResult = id => {
	loading.result = true
	studentResult(id)
		.then(res => {
			const { result = [], information = [] }
        = res
			studentMessage.scoreList = result?.[0] || {}
			studentMessage.information
        = information?.[0] || {}
		})
		.catch(e => {
			console.warn(e)
		})
		.finally(() => {
			loading.result = false
		})
}

watch(
	() => route.query.id,
	val => {
		selectID.value = val
		getResult(val)
	},
	{ immediate: true, deep: true },
)
</script>

<template>
  <div class="result-content">
    <StudentTree v-model:student="selectID" />
    <div
      class="right-content"
      v-loading="loading.result"
    >
      <div class="title">
        {{ studentMessage.information.Name }}
        {{
          CLASS_TRANSLATE[
            studentMessage.information.Class
          ]
        }}
        {{
          GRADE_TRANSLATE[
            studentMessage.information.Grade
          ]
        }}
      </div>
      <div
        v-if="selectID"
        class="result"
      >
        <template
          v-if="
            !isEmpty(studentMessage.scoreList)
          "
        >
          <template
            v-for="(
              value, key
            ) in studentMessage.scoreList"
            :key="key"
          >
            <SubjectScore
              :score="value"
              :subject="key"
              :msg="studentMessage.information"
            />
          </template>
        </template>
        <template v-else>
          暂无成绩
        </template>
      </div>
      <div
        v-else
        class="result"
      >
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
