<script setup>
import { ref, computed } from 'vue'
const gradeRadio = ref(1)

const checkAll = ref(false)
const isIndeterminate = ref(true)
const checkedCities = ref([])
const perClass = ['一班', '二班', '三班', '四班']

const handleCheckAllChange = val => {
  checkedCities.value = val ? perClass : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = value => {
  const checkedCount = value.length
  checkAll.value =
    checkedCount === perClass.length
  isIndeterminate.value =
    checkedCount > 0 &&
    checkedCount < perClass.length
}
handleCheckAllChange()
</script>

<template>
  <div class="advantage-content">
    <div class="select-content">
      <div class="grade-select">
        <el-radio-group v-model="gradeRadio">
          <el-radio-button label="1" size="large">
            初一
          </el-radio-button>
          <el-radio-button label="2" size="large">
            初二
          </el-radio-button>
          <el-radio-button label="3" size="large">
            初三
          </el-radio-button>
        </el-radio-group>
      </div>

      <div class="checkbox-content">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >
          全选
        </el-checkbox>
        <el-checkbox-group
          class="class-select"
          v-model="checkedCities"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox
            v-for="item in perClass"
            :key="item"
            :label="item"
            size="large"
          >
            {{ item }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="result-content"> 111 </div>
  </div>
</template>

<style scoped lang="scss">
.advantage-content {
  padding: 32px;
  display: flex;
  .select-content {
    flex: 1;
    .grade-select {
      margin-bottom: 16px;
    }
    .checkbox-content {
      .class-select {
        display: flex;
        flex-direction: column;
      }
    }
  }
  .result-content {
    flex: 5;
  }
}
</style>
