<script setup>
import { computed, ref, watch } from 'vue'
import * as XLSX from 'xlsx'
import config, { TOKEN_KEY } from '../../config/index.js'
import { UploadFilled } from '@element-plus/icons-vue'
import { addStudent,
	downloadStudentTemplate,
	uploadFile } from '../../api/index.js'
import storage from '../../utils/storage.js'
import { ElMessage,
	genFileId } from 'element-plus'
import { STUDENT_KEY_TRANSLATE,
	LETTER_TO_NUMBER } from '../../constant'

const column = computed(() => {
	return excelData.value[0]?.header.map(item => {
		return {
			field: STUDENT_KEY_TRANSLATE[item],
			title: item,
		}
	})
})

const submitDisable = ref(true)
const excelData = ref([])
const uploadRef = ref(null)
const file = ref([])
const flag = ref([])
const loading = ref(false)

const tableData = computed(() => {
	return excelData.value[0]?.results.map(item => {
		return {
			StudentID: item['座号'],
			Name: item['姓名'],
			Class: item['班级'],
			Grade: item['年级'],
		}
	})
})

const submitDisabled = computed(() => {
	return !(
		!flag.value.length && file.value.length
	)
})

const header = computed(() => {
	return {
		Authorization: `Bearer ${storage.getItem(
			TOKEN_KEY,
		)}`,
	}
})
const submitUpload = () => {
	// uploadRef?.value.submit()
	loading.value = true
	addStudent(tableData.value)
		.then(res => {
			loading.value = false
		})
		.catch(e => {
			loading.value = false
			console.warn(e)
		})
}

const initFileData = () => {
	flag.value = []
	excelData.value = []
	submitDisable.value = true
}

const fileSubmit = (e, files) => {
	let fileContent = ''
	const rawFile = e && e.raw // only setting files[0]
	if (!rawFile) return

	const reader = new FileReader()
	reader.onload = ev => {
		fileContent = ev.target.result
		const workbook = XLSX.read(fileContent, {
			type: 'array',
			cellDates: true,
		})
		for (const sheetName of workbook.SheetNames) {
			const worksheet = workbook.Sheets[sheetName]
			const header = getHeaderRow(worksheet)
			if (typeof header === 'number') {
				flag.value.push({
					c: LETTER_TO_NUMBER[header],
					r: 2,
				})
				return
			}
			const results = XLSX.utils.sheet_to_json(
				worksheet,
				{
					raw: true,
					defval: null,
				},
			)
			excelData.value.push({
				header,
				results,
				meta: { sheetName },
			})
		}
		// console.log(workbook);
	}
	reader.readAsArrayBuffer(rawFile)
}

function getHeaderRow (sheet) {
	if (!sheet || !sheet['!ref']) return []
	const headers = []
	// A3:B7=>{s:{c:0, r:2}, e:{c:1, r:6}}
	const range = XLSX.utils.decode_range(
		sheet['!ref'],
	)
	const R = range.s.r
	/* start in the first row */
	for (let C = range.s.c; C <= range.e.c; ++C) {
		/* walk every column in the range */
		const cell
      = sheet[
      	XLSX.utils.encode_cell({ c: C, r: R })
      ]
		/* find the cell in the first row */
		let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
		if (cell && cell.t) { hdr = XLSX.utils.format_cell(cell) } else {
			return C
		}
		headers.push(hdr)
	}

	for (let W = range.s.c; W <= range.e.c; ++W) {
		for (let H = range.s.r; H <= range.e.r; ++H) {
			const cell
        = sheet[
        	XLSX.utils.encode_cell({ c: W, r: H })
        ]
			if (!cell) {
				flag.value.push({
					c: LETTER_TO_NUMBER[W + 1],
					r: H + 1,
				})
			}
		}
	}
	return headers
}

const handleExceed = files => {
	uploadRef.value.clearFiles()
	initFileData()
	const fileExceed = files[0]
	fileExceed.uid = genFileId()
	uploadRef.value.handleStart(fileExceed)
}

const downloadTemplate = () => {
	downloadStudentTemplate()
		.then(res => {
			window.open(res)
		})
		.catch(err => {
			console.warn(err)
		})
}
</script>

<template>
  <div class="upload-content">
    <div class="upload-error-tip">
      <span>
        <el-button
          link
          type="primary"
          @click="downloadTemplate"
          class="template-button"
        >
          下载文件模板
        </el-button>
      </span>

      <el-upload
        v-model:file-list="file"
        ref="uploadRef"
        drag
        :headers="header"
        :action="`${config.baseApi}/student/uploadFile`"
        :auto-upload="false"
        :on-change="fileSubmit"
        :limit="1"
        :on-exceed="handleExceed"
        :on-remove="initFileData"
        accept=".xlsx,.xls"
        class="upload"
      >
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">
          拖拽文件到此处或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            请上传xlsx或xls文件
          </div>
        </template>
      </el-upload>
      <div class="tips">
        <el-card class="tip-card">
          <span v-if="!file.length">
            加载文件后此处显示是否有格式错误
          </span>
          <div
            v-else
            v-for="(item, index) in flag"
            :key="index"
            class="tip-content"
          >
            excel中{{ item.c }}列{{
              item.r
            }}行为空
          </div>
          <span
            v-if="!flag.length && file.length"
          >
            格式正确，点击下方按钮确认上传数据
          </span>
        </el-card>
        <el-button
          class="ml-3"
          type="success"
          @click="submitUpload"
          :disabled="submitDisabled"
        >
          确认上传
        </el-button>
      </div>
    </div>
    <div class="table-content">
      <vxe-grid
        :columns="column"
        :data="tableData"
        align="center"
        height="800px"
        show-overflow
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.upload-content {
  display: flex;
  padding: 32px;
  .upload-error-tip {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: calc(100vh - 154px);
    .template-button {
      width: auto;
      font-size: 18px;
      margin-right: 16px;
      margin-bottom: 16px;
    }
    .upload {
      margin-right: 16px;
      margin-bottom: 64px;
    }
    .tips {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      .tip-card {
        margin-bottom: 32px;
        min-width: 400px;
        min-height: 110px;
        display: flex;
        justify-content: center;
        align-items: center;
        .tip-content {
          margin-bottom: 4px;
        }
      }
    }
  }
  .table-content {
    flex: 1;
  }
}
</style>
