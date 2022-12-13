<script setup>
import { reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getStudentInformation,
	searchStudent } from '../api'
import StudentSearch from './StudentSearch.vue'

const route = useRoute()
const router = useRouter()

const props = defineProps({
	student: {
		type: [Number, null],
		default: null,
	},
})

const searchStudentID = ref(null)

const selectStudent = ref(null)

const emit = defineEmits(['update:student',
	'getStudentResult'])

const loading = reactive({ tree: false })
const tree = ref([])

const treeRef = ref(null)

const handleNodeClick = data => {
	if (data?.StudentID) {
		selectStudent.value = data.StudentID
		const query = { ...route.query }
		router.push({ query: Object.assign(query, { id: data.StudentID }) })
		searchStudentID.value = null
		emit('update:student', selectStudent.value)
	}
}

const setNotExpanded = () => {
	tree.value.forEach(item => {
		const node
      = treeRef.value.store.nodesMap[item.children]
		if (node) {
			node.expanded = false
		}
	})
}

const searchChange = val => {
	setNotExpanded()
	selectStudent.value = val
	emit('update:student', selectStudent.value)

	const query = { ...route.query }
	router.push({ query: Object.assign(query, { id: val }) })
	treeRef.value.setCurrentKey(val)
	setTimeout(() => {
		document.getElementById(val).scrollIntoView({
			block: 'start',
			behavior: 'smooth',
		})
	}, 1000)
}

const getTreeData = () => {
	loading.tree = true
	getStudentInformation()
		.then(res => {
			const { treeData } = res
			tree.value = treeData
		})
		.catch(e => {
			console.warn(e)
		})
		.finally(() => {
			loading.tree = false
		})
}

getTreeData()

watch(searchStudentID, val => {
	if (val) {
		searchChange(val)
	} else {
		emit('update:student', null)
	}
})
</script>

<template>
  <div class="tree-content">
    <StudentSearch
      v-model:student="searchStudentID"
    />
    <div class="tree">
      <el-scrollbar always>
        <el-tree
          ref="treeRef"
          v-loading="loading.tree"
          element-loading-background="white"
          accordion
          :data="tree"
          node-key="StudentID"
          :highlight-current="true"
          @node-click="handleNodeClick"
        >
          <template #default="{ data }">
            <div
              class="tree-node"
              :id="data.StudentID"
            >
              {{ data.label }}
            </div>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tree-content {
  border: #eeeeee solid 1px;
  border-radius: 3px;
  padding: 10px;
  margin: 16px;
  width: 190px;
  height: calc(100vh - 120px);
  :deep(.el-tree-node__content) {
    height: 50px;
  }
  .select-item {
    margin-bottom: 10px;
  }
  .tree {
    height: calc(100vh - 180px);
  }
}
</style>
