<script setup>
import { computed, ref } from 'vue'
import * as XLSX from 'xlsx'

const column = computed(() => {
  return excelData.value[0]?.header.map(item => {
    console.log(item)
    return {
      field: item,
      title: item,
    }
  })
})
const data = ref(null)
const excelData = ref([])

let fileContent = ''
const fileSubmit = e => {
  const files = e && e.target.files
  const rawFile = files && files[0] // only setting files[0]
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
</script>

<template>
  upload
  <div>
    <input type="file" @change="fileSubmit" />
  </div>
  <vxe-grid
    :columns="column"
    :data="excelData[0]?.results"
  />
</template>

<style scoped></style>
