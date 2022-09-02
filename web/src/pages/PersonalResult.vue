<script setup >
import { reactive, ref, watch, watchEffect } from 'vue';
import { studentResult } from '../api'
import StudentTree from '../components/StudentTree.vue'

const loading = reactive({
    result: false
})

const selectID = ref(null)

const getResult = (id) => {
    studentResult(id).then((res) => {
        console.log(res);
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
            {{ selectID }}
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
        }
      }

    </style >
    