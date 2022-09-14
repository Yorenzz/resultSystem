<script setup>
import { computed, ref } from 'vue'
import * as XLSX from 'xlsx'
import config, {
  TOKEN_KEY,
} from '../config/index.js'
import { UploadFilled } from '@element-plus/icons-vue'
import { uploadFile } from '../api/index.js'
import storage from '../utils/storage.js'

const column = computed(() => {
  return excelData.value[0]?.header.map(item => {
    console.log(item)
    return {
      field: item,
      title: item,
    }
  })
})
const header = computed(() => {
  return {
    Authorization: `Bearer ${storage.getItem(
      TOKEN_KEY,
    )}`,
  }
})
const data = ref(null)
const excelData = ref([])
const uploadRef = ref(null)
const file = ref([])
const uploadFileContent = ref(null)

const submitUpload = () => {
  uploadRef?.value.submit()
}

let fileContent = ''
const fileSubmit = (e, files) => {
  console.log(e, file.value)
  uploadFileContent.value = files
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
      let results = XLSX.utils.sheet_to_json(
        worksheet,
        {
          raw: true,
          defval: null,
        },
      )
      excelData.value.push({
        header,
        results,
        meta: {
          sheetName,
        },
      })
      console.log(excelData.value)
    }
    // console.log(workbook);
  }
  reader.readAsArrayBuffer(rawFile)
}

function getHeaderRow(sheet) {
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
    const cell =
      sheet[
        XLSX.utils.encode_cell({ c: C, r: R })
      ]
    /* find the cell in the first row */
    let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
    if (cell && cell.t)
      hdr = XLSX.utils.format_cell(cell)
    headers.push(hdr)
  }
  return headers
}

const uploadHttpRequest = params => {
  const form = new FormData()
  form.append('file', params.file)
  console.log(form, params.file)
  uploadFile(params.file).then(res => {
    console.log(res)
  })
}
</script>

<template>
  <div>
    <el-upload
      v-model:file-list="file"
      ref="uploadRef"
      drag
      :headers="header"
      :action="`${config.baseApi}/student/uploadFile`"
      :auto-upload="false"
      :on-change="fileSubmit"
      accept=".xlsx,.xls"
    >
      <el-icon class="el-icon--upload"
        ><upload-filled
      /></el-icon>
      <div class="el-upload__text">
        拖拽文件到此处或<em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          请上传xlsx或xls文件
        </div>
      </template>
    </el-upload>
    <el-button
      class="ml-3"
      type="success"
      @click="submitUpload"
    >
      确认上传
    </el-button>
  </div>
  <vxe-grid
    :columns="column"
    :data="excelData[0]?.results"
  />
</template>

<style scoped></style>
