<script setup >
import { reactive, ref, watch, watchEffect } from 'vue';
import { studentResult } from '../api'
import StudentTree from '../components/StudentTree.vue'
import SubjectScore from '../components/SubjectScore.vue'
import { GRADE_ONE_SUBJECT } from '../constant/index.js'

const loading = reactive({
    result: false
})

let scoreList = reactive({})

const selectID = ref(null)

const getResult = (id) => {
    studentResult(id).then((res) => {
        console.log(res);
				scoreList =  Object.assign(scoreList, res[0])
    })
}

watchEffect(()=>{
    if(selectID.value){
        console.log('type', typeof selectID.value);
        getResult(selectID.value)
    }
})
</script >

<template >
    <div class="result-content">
        <StudentTree
            v-model:student="selectID"
        />
        <div
            v-if="selectID"
            class="result"
        >
            <template
							v-for="(value, key) in scoreList"
						>
							<SubjectScore
								:score="value"
								:subject="key"
							/>
						</template>
        </div>
        <div
            v-else
            class="result"
        >
            请点击左侧选择学生查看学生成绩
        </div>
    </div>
</template >

    <style scoped lang="scss">
      .result-content {
        display: flex;
        .result {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
					flex-wrap: wrap;
        }
      }

    </style >
