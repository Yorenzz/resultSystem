<script setup>
import { searchStudent } from '../api/index.js'
import { reactive, watch } from 'vue'

const props = defineProps({
	student: {
		type: [Number, null],
		default: null,
	},
})

const emit = defineEmits(['update:student'])

const search = reactive({
	studentID: null,
	searchList: [],
})
const loading = reactive({
	tree: false,
	search: false,
})
const handleChange = () => {
	if (!search.studentID) {
		emit('update:student', null)
	} else {
		emit('update:student', search.studentID)
	}
}
const remoteMethod = keyword => {
	if (keyword) {
		loading.search = true
		searchStudent(keyword).then(res => {
			search.searchList = res
			loading.search = false
		})
	} else {
		search.searchList = []
	}
}

watch(
	() => props.student,
	val => {
		if (!val) {
			search.studentID = null
			search.searchList = []
		}
	},
)
</script>

<template>
  <div class="select-item">
    <el-select
      v-model="search.studentID"
      filterable
      remote
      :remote-method="remoteMethod"
      :clearable="true"
      :reserve-keyword="false"
      :loading="loading.search"
      placeholder="请搜索学生姓名"
      @change="handleChange"
    >
      <el-option-group
        v-if="search.searchList.length"
        label="学生"
      >
        <el-option
          v-for="item in search.searchList"
          :key="`${item.Name}-${item.StudentID}`"
          :label="item.Name"
          :value="item.StudentID"
        />
      </el-option-group>
    </el-select>
  </div>
</template>

<style scoped lang="scss">
.select-item {
  margin-bottom: 10px;
}
</style>
