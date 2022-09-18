<script setup>
import { ref, computed } from 'vue'
import { useClassStore } from '../store/classMessage.js'
import {
  CLASS_TRANSLATE,
  CLASS_TRANSLATE_REVERSE,
} from '../constant/index.js'
const checkedGrade = ref(1)

const store = useClassStore()
const checkAll = ref(false)
const isIndeterminate = ref(true)
const checkedClass = ref(null)

const perClass = computed(() => {
  return store
    .getPerClass(checkedGrade.value)
    .map(item => {
      return CLASS_TRANSLATE[item.Class]
    })
})

const classFormat = computed(() => {
  return checkedClass.value.map(item => {
    return CLASS_TRANSLATE_REVERSE[item]
  })
})

const handleCheckAllChange = val => {
  checkedClass.value = val ? perClass.value : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = value => {
  const checkedCount = value.length
  checkAll.value =
    checkedCount === perClass.value.length
  isIndeterminate.value =
    checkedCount > 0 &&
    checkedCount < perClass.value.length
}

handleCheckAllChange()
</script>

<template>
  <div class="advantage-content">
    <div class="select-content">
      <div class="grade-select">
        <el-radio-group v-model="checkedGrade">
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
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >
          全选
        </el-checkbox>
        <el-checkbox-group
          class="class-select"
          v-model="checkedClass"
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
    <div class="result-content">
      {{ checkedGrade }}
      {{ classFormat }}
      <el-descriptions
        title="各科平均分"
        direction="vertical"
        :column="4"
        border
        class="advantage-content-score"
      >
        <el-descriptions-item label="语文">
          kooriookami
        </el-descriptions-item>
        <el-descriptions-item label="数学">
          18100000000
        </el-descriptions-item>
        <el-descriptions-item label="数学">
          18100000000
        </el-descriptions-item>
        <el-descriptions-item label="数学">
          18100000000
        </el-descriptions-item>
        <el-descriptions-item label="数学">
          18100000000
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions
        title="各科平均分变动趋势"
        direction="vertical"
        :column="4"
        border
        class="advantage-content-trend"
      >
        <el-descriptions-item label="语文">
          kooriookami
        </el-descriptions-item>
        <el-descriptions-item label="数学">
          18100000000
        </el-descriptions-item>
        <el-descriptions-item label="数学">
          18100000000
        </el-descriptions-item>
        <el-descriptions-item label="数学">
          18100000000
        </el-descriptions-item>
        <el-descriptions-item label="数学">
          18100000000
        </el-descriptions-item>
      </el-descriptions>
    </div>
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
    display: flex;
    .advantage-content-score {
      margin-right: 16px;
      flex: 1;
    }
    .advantage-content-trend {
      flex: 1;
    }
  }
}
</style>
