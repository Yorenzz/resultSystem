<script setup>
import { reactive, ref } from 'vue'
import { getStudentInformation, searchStudent } from '../api'

const props = defineProps({
    student: {
        type: [Number, null],
        default: null,
    },
})

const selectStudent = ref(null)

const emit = defineEmits(['update:student', 'getStudentResult'])

const loading = reactive({
    tree: 'false',
})
const search = reactive({
    studentId: '',
})
const tree = ref([])
const remoteMethod = keyword => {
    console.log(keyword)
    searchStudent(keyword)
}
const handleNodeClick = data => {
    // console.log('data', data);
    if (data?.StudentId) {
        console.log('1', typeof data?.StudentId)
        selectStudent.value = data.StudentId
        emit('update:student', selectStudent.value)
    }
}
const getTreeData = () => {
    loading.tree = true
    getStudentInformation()
        .then(res => {
            // console.log(res);
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
</script>

<template>
    <div class="tree-content">
        <div class="select-item">
            <el-select
                v-model="search.studentId"
                filterable
                remote
                :remote-method="remoteMethod"
                :clearable="true"
                placeholder="请搜索学生姓名"
            >
            </el-select>
        </div>
        <div class="tree">
            <el-scrollbar always>
                <el-tree
                    v-loading="loading.tree"
                    element-loading-background="white"
                    accordion
                    :data="tree"
                    @node-click="handleNodeClick"
                >
                    <template #default="{ data }">
                        <div class="tree-node">
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
