<script setup>
import LeftNav from '../components/LeftNav.vue'
import BreadCrumb from '../components/BreadCrumb.vue'
import { ref } from 'vue'
import { getClass } from '../api/index.js'
import { useClassStore } from '../store/classMessage.js'

const store = useClassStore()
const fullscreenLoading = ref(false)
const getPerClass = () => {
	fullscreenLoading.value = true
	getClass(1).then(res => {
		store.setOne(res)
	}).catch(err => {
		console.warn(err)
	}).finally(() => {
		fullscreenLoading.value = false
	})
	getClass(2).then(res => {
		store.setTwo(res)
	}).catch(err => {
		console.warn(err)
	}).finally(() => {
		fullscreenLoading.value = false
	})
	getClass(3).then(res => {
		store.setThree(res)
	}).catch(err => {
		console.warn(err)
	}).finally(() => {
		fullscreenLoading.value = false
	})
}

!store.gradeOneClass.length && getPerClass()
</script>

<template>
  <div
    class="nav-side"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <LeftNav />
  </div>
  <div class="basic-layout">
    <div class="nav-top">
      <BreadCrumb />
    </div>
    <div class="wrapper">
      <div class="main-page">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.nav-side {
  width: 230px;
  height: 100vh;
  top: 0;
  position: fixed;
}
.basic-layout {
  height: auto;
  margin-left: 230px;

  .nav-top {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-left: 16px;
    height: 50px;
    line-height: 50px;
  }

  .wrapper {
    background: #eef0f3;
    padding: 20px;
    min-height: calc(100vh - 50px);
    .main-page {
      background: #fff;
      min-height: calc(100vh - 90px);
    }
  }
}
</style>
