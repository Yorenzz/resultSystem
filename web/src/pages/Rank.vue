<script setup>
import { computed, reactive, ref } from 'vue'
import { useClassStore } from '../store/classMessage.js'
import { CLASS_TRANSLATE,
	CLASS_TRANSLATE_REVERSE,
	SUBJECT_TRANSLATE,
	GRADE_SUBJECT } from '../constant/index.js'
import { getRank } from '../api/index.js'
const store = useClassStore()
const checkedGrade = ref(1)
const checkedClass = ref(null)
const checkedSubject = ref('Chinese')
const loading = reactive({ table: false })
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
const column = ref([{
	field: 'rank',
	title: '名次',
},
{
	field: 'Name',
	title: '姓名',
},
{
	field: 'Class',
	title: '班级',
},

{
	field: 'score',
	title: '分数',
}])

const tableData = ref([])

const handleCancel = () => {
	checkedClass.value = null
	getResultRank()
}

const getResultRank = () => {
	loading.table = true
	getRank(checkedGrade.value, classFormat.value, checkedSubject.value).then((res) => {
		console.log(res)
		tableData.value = res.map(item => {
			return {
				rank: item.t_rank,
				Name: item.Name,
				Class: item.Class,
				score: item[checkedSubject.value],
			}
		})
	}).catch((err) => {
		console.warn(err)
	}).finally(() => {
		loading.table = false
	})
}
getResultRank()
</script>

<template>
  <div class="rank">
    <div class="left-content">
      <div class="select-content">
        <div class="grade-select">
          <el-radio-group
            v-model="checkedGrade"
            @change="getResultRank"
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
            @change="getResultRank"
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
            @change="getResultRank"
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
      <vxe-grid
        :columns="column"
        ref="tableRef"
        border
        align="center"
        show-overflow
        height="auto"
        :loading="loading.table"
        :data="tableData"
      />
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
    }
}
</style>
