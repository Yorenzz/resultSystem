<script setup>
import { getTestTime } from '../../api/index.js'

const testTimeMes = () => {
  getTestTime()
    .then(res => {
      console.log(res)
    })
    .catch(e => {
      console.warn(e)
    })
}
testTimeMes()
</script>

<template>
  当前考试类型 当前学年所有考试类型
</template>

<style scoped></style>
