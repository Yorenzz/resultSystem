<script setup>
import { ElMessageBox } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { getStudentInformation,
	changeStudentInformation,
	addStudentInformation,
	deleteStudentInformation } from '../../api'
import { CLASS_TRANSLATE,
	GRADE_TRANSLATE } from '../../constant'
import { InfoFilled } from '@element-plus/icons-vue'

const tableData = ref([])
const ruleFormRef = ref(null)
const addFormRef = ref(null)
const tableRef = ref(null)
const loading = reactive({
	table: false,
	button: false,
})
const dataVerify = computed(() => {
	return tableData.value.map(item => {
		return item.StudentID
	})
})
let editData = reactive({
	originalData: null,
	nowData: null,
	changeField: null,
	changeTitle: '',
	originalAll: {},
})
const addData = reactive({
	name: '',
	grade: null,
	Class: null,
	id: null,
})
const deleteData = ref([])
const deleteConfirm = ref(false)
const isEdit = ref(false)
const isAdd = ref(false)

const toolbar = computed(() => {
	return isAdd.value
		? {
			custom: false,
			slots: { buttons: 'toolbar_buttons' },
		}
		: {}
})
const checkboxChangeEvent = data => {
	deleteData.value = data.records.map(item => {
		return item.StudentID
	})
}
const column = computed(() => {
	if (isAdd.value) {
		return [
			{ type: 'seq', width: 60 },
			{ type: 'checkbox', width: 50 },
			{
				field: 'StudentID',
				title: '编号',
				slots: { default: 'id' },
			},
			{
				field: 'Name',
				title: '姓名',
				slots: { default: 'name' },
			},
			{
				field: 'Grade',
				title: '年级',
				slots: { default: 'grade' },
			},
			{
				field: 'Class',
				title: '班级',
				slots: { default: 'class' },
			},
			{
				title: '操作',
				slots: { default: 'operate' },
			},
		]
	} else {
		return [{
			field: 'StudentID',
			title: '编号',
			slots: { default: 'id' },
		},
		{
			field: 'Name',
			title: '姓名',
			slots: { default: 'name' },
		},
		{
			field: 'Grade',
			title: '年级',
			slots: { default: 'grade' },
		},
		{
			field: 'Class',
			title: '班级',
			slots: { default: 'class' },
		}]
	}
})

const dataPass = (rule, value, callback) => {
	const reg = /^[\u4E00-\u9FA5]+$/
	const IDreg = /^[1-3][1-9](0[1-9]|[1-9][0-9])$/
	if (!value || value === editData.originalData) {
		callback(new Error('请输入修改数据'))
	} else if (
		editData.changeField === 'Name'
    && !reg.test(value)
	) {
		callback(new Error('请输入中文姓名！'))
	} else if (
		editData.changeField !== 'Name'
    && isNaN(value - 0)
	) {
		callback(new Error('请输入整数数字！'))
	} else if (
		editData.changeField === 'StudentID'
    && !IDreg.test(value)
	) {
		callback('请检查编号格式！')
	} else if (
		editData.changeField === 'Grade'
    && (value < 1 || value > 3)
	) {
		callback('请检查年级格式！')
	} else if (
		editData.changeField === 'Class'
    && (value < 1 || value > 9)
	) {
		callback('请检查班级格式！')
	} else {
		callback()
	}
}

const namePass = (rule, value, callback) => {
	const reg = /^[\u4E00-\u9FA5]+$/
	if (!reg.test(value)) {
		callback(new Error('请输入中文姓名！'))
	} else {
		callback()
	}
}

const gradePass = (rule, value, callback) => {
	if (value > 3 || value < 1) {
		callback(new Error('请输入数字1-3！'))
	} else {
		callback()
	}
}
const classPass = (rule, value, callback) => {
	if (value > 9 || value < 1) {
		callback(new Error('请输入数字1-9！'))
	} else {
		callback()
	}
}
const idPass = (rule, value, callback) => {
	if (value > 99 || value < 1) {
		callback(new Error('请输入数字1-99！'))
	} else {
		callback()
	}
}
const rules = reactive({ nowData: [{ validator: dataPass, trigger: 'blur' }] })

const addRule = reactive({
	name: [{ validator: namePass, trigger: 'blur' }],
	grade: [{ validator: gradePass, trigger: 'blur' }],
	Class: [{ validator: classPass, trigger: 'blur' }],
	id: [{ validator: idPass, trigger: 'blur' }],
})

const editMode = () => {
	if (isEdit.value) {
		editData = Object.assign(editData, {
			originalData: null,
			nowData: null,
			changeField: null,
			changeTitle: '',
			originalAll: {},
		})
	}
	isEdit.value = !isEdit.value
}

const addMode = () => {
	isAdd.value = !isAdd.value
}

const handleEditData = (row, column) => {
	const { field, title } = column
	editData.originalData = row[field]
	editData.originalAll = row
	editData.changeField = field
	editData.changeTitle = title
	editData.nowData = null
}

const initData = () => {
	editData.changeField = null
	editData.changeTitle = null
	editData.nowData = null
	editData.originalData = null
	editData.originalAll = {}
}

const removeStudent = row => {
	ElMessageBox.confirm(
		'确定删除?此操作无法撤销',
		'提示',
		{
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
			closeOnClickModal: false,
		},
	)
		.then(() => {
			deleteStudentInformation([row.StudentID])
				.then(res => {
					getInformation()
					deleteData.value = []
				})
				.catch(err => {
					console.warn(err)
				})
		})
		.catch(() => {})
}

const allRemove = () => {
	deleteConfirm.value = false
	deleteStudentInformation(deleteData.value)
		.then(res => {
			getInformation()
			deleteData.value = []
		})
		.catch(err => {
			console.warn(err)
		})
}

const editSubmit = () => {
	ruleFormRef.value.validate().then(() => {
		if (
			editData.changeField === 'StudentID'
      && (editData.originalData + '').slice(0, 2)
        !== (editData.nowData + '').slice(0, 2)
		) {
			ElMessageBox.alert(
				'修改类型为编号时不支持修改年级或班级',
				'注意：',
				{ confirmButtonText: '返回' },
			)
		} else {
			changeStudent()
		}
	})
}

const addSubmit = () => {
	addFormRef.value.validate().then(() => {
		addStudent()
	})
}

const changeStudent = () => {
	loading.button = true
	changeStudentInformation(
		editData.originalAll.StudentID,
		editData.nowData,
		editData.changeField,
	)
		.then(res => {
			getInformation()
		})
		.catch(e => {
			console.warn(e)
		})
		.finally(() => {
			loading.button = false
			initData()
		})
}

const addStudent = () => {
	loading.button = true
	addStudentInformation(
		addData.name,
		addData.grade,
		addData.Class,
		addData.id,
	)
		.then(res => {
			getInformation()
			addData.grade = null
			addData.name = null
			addData.Class = null
			addData.id = null
		})
		.catch(e => {
			console.warn(e)
		})
		.finally(() => {
			loading.button = false
			initData()
		})
}

const getInformation = () => {
	loading.table = true
	getStudentInformation()
		.then(res => {
			const { studentList } = res
			tableData.value = studentList
		})
		.catch(e => {
			console.warn(e)
		})
		.finally(() => {
			loading.table = false
		})
}
getInformation()
</script>

<template>
  <div class="student-content">
    <div class="table-content">
      <vxe-grid
        ref="tableRef"
        border
        align="center"
        :data="tableData"
        :columns="column"
        show-overflow
        height="auto"
        :toolbar-config="toolbar"
        :loading="loading.table"
        @checkbox-change="checkboxChangeEvent"
        @checkbox-all="checkboxChangeEvent"
      >
        <template
          #toolbar_buttons
          v-if="isAdd"
        >
          <el-popover
            v-model:visible="deleteConfirm"
            trigger="click"
            placement="bottom"
            :width="160"
          >
            <p>
              确定删除选中学生信息?此操作无法撤销
            </p>
            <div
              style="text-align: right; margin: 0"
            >
              <el-button
                size="small"
                text
                @click="deleteConfirm = false"
              >
                取消
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="allRemove"
              >
                确定
              </el-button>
            </div>
            <template #reference>
              <el-button
                :disabled="
                  deleteData.length === 0
                "
              >
                批量删除
              </el-button>
            </template>
          </el-popover>
        </template>
        <template #id="{ row, column }">
          <span v-if="!isEdit">
            {{
              row.StudentID
            }}
          </span>
          <el-button
            link
            type="primary"
            v-else
            @click="handleEditData(row, column)"
          >
            {{ row.StudentID }}
          </el-button>
        </template>
        <template #name="{ row, column }">
          <span v-if="!isEdit">
            {{
              row.Name
            }}
          </span>
          <el-button
            link
            type="primary"
            v-else
            @click="handleEditData(row, column)"
          >
            {{ row.Name }}
          </el-button>
        </template>
        <template #grade="{ row, column }">
          <span v-if="!isEdit">
            {{
              row.Grade
            }}
          </span>
          <el-button
            link
            type="primary"
            v-else
            @click="handleEditData(row, column)"
          >
            {{ row.Grade }}
          </el-button>
        </template>
        <template #class="{ row, column }">
          <span v-if="!isEdit">
            {{
              row.Class
            }}
          </span>
          <el-button
            link
            type="primary"
            v-else
            @click="handleEditData(row, column)"
          >
            {{ row.Class }}
          </el-button>
        </template>
        <template #operate="{ row }">
          <vxe-button
            title="删除"
            @click="removeStudent(row)"
          >
            删除
          </vxe-button>
        </template>
      </vxe-grid>
    </div>
    <div class="edit-content">
      <div>
        <el-button
          type="primary"
          @click="editMode"
          :disabled="isAdd"
        >
          <span v-if="!isEdit">
            点击进入编辑模式
          </span>
          <span v-else>点击退出编辑模式</span>
        </el-button>
        <el-button
          type="primary"
          @click="addMode"
          :disabled="isEdit"
        >
          <span v-if="!isAdd">
            点击进入增加/删除模式
          </span>
          <span v-else>
            点击退出增加/删除模式
          </span>
        </el-button>
      </div>
      <div
        class="edit"
        v-if="isEdit"
      >
        <div
          class="data-title"
          v-if="!editData.originalData"
        >
          请在左侧点击想要编辑的数据
        </div>
        <div
          class="edit-type"
          v-if="editData.originalData"
        >
          <el-card
            shadow="never"
            style="display: flex"
          >
            <div class="card-type">
              编辑类型：{{ editData.changeTitle }}
              <div
                class="icon-edit-id"
                v-if="
                  editData.changeField ===
                    'StudentID'
                "
              >
                <el-popover
                  placement="bottom"
                  :width="200"
                  trigger="hover"
                  content="编号首位代表年级，第二次代表班级，最后两位代表座号，编辑编号时不支持更改前两位"
                >
                  <template #reference>
                    <el-icon color="#666c77">
                      <QuestionFilled />
                    </el-icon>
                  </template>
                </el-popover>
              </div>

              &emsp;数据归属：
              {{
                GRADE_TRANSLATE[
                  editData.originalAll.Grade
                ]
              }}
              {{
                CLASS_TRANSLATE[
                  editData.originalAll.Class
                ]
              }}
              {{ editData.originalAll.Name }}
            </div>
          </el-card>
        </div>

        <div
          class="edit-data"
          v-if="editData.originalData"
        >
          <div class="original-data">
            <div class="data-title">
              原数据
            </div>
            <div>{{ editData.originalData }}</div>
          </div>
          <div class="now-data">
            <div class="data-title">
              修改后数据
            </div>
            <el-form
              class="now-data-form"
              ref="ruleFormRef"
              :model="editData"
              :rules="rules"
            >
              <el-form-item
                :inline="true"
                prop="nowData"
              >
                <el-input
                  v-model="editData.nowData"
                  style="width: 100%"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div
          class="edit-submit"
          v-if="editData.originalData"
        >
          <el-button
            type="primary"
            @click="editSubmit"
            size="large"
            color="#80e1d9"
          >
            <span class="white-text">
              确认修改
            </span>
          </el-button>
        </div>
      </div>
      <div
        class="add"
        v-if="isAdd"
      >
        <el-form
          :model="addData"
          :rules="addRule"
          ref="addFormRef"
        >
          <el-form-item
            label="姓名"
            prop="name"
          >
            <el-input
              v-model="addData.name"
            />
          </el-form-item>
          <el-form-item
            label="年级"
            prop="grade"
          >
            <el-input
              v-model="addData.grade"
            />
          </el-form-item>
          <el-form-item
            label="班级"
            prop="Class"
          >
            <el-input
              v-model="addData.Class"
            />
          </el-form-item>
          <el-form-item
            label="座号"
            prop="id"
          >
            <el-input
              v-model="addData.id"
            />
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          @click="addSubmit"
        >
          提交
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.student-content {
  display: flex;
  .table-content {
    height: calc(100vh - 154px);
    width: 550px;
    margin: 10px 32px 32px;
  }
  .edit-content {
    flex: 1;
    margin: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: calc(100vh - 154px);
    .edit {
      flex: 1;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-bottom: 100px;
      .data-title {
        margin-bottom: 16px;
      }
      .edit-type {
        padding-bottom: 32px;
        .card-type {
          display: flex;
          justify-content: center;
          align-items: center;
          .icon-edit-id {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 4px;
          }
        }
      }
      .edit-data {
        margin-top: 32px;
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        justify-content: space-around;
        font-size: 20px;
        .original-data {
          width: 30%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .now-data {
          width: 40%;
          display: flex;
          flex-direction: column;
          align-items: center;
          .now-data-form {
            width: 50%;
            :deep(.el-form-item) {
              margin: 0;
            }
          }
        }
      }
      .edit-submit {
        margin-top: 150px;
        .white-text {
          color: white;
        }
      }
    }
    .add {
      flex: 1;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-bottom: 100px;
    }
  }
}
</style>
