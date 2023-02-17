<script setup>
import { getClass } from './api/index.js'
import { useClassStore } from './store/classMessage.js'
import { ref } from 'vue'

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
getPerClass()
</script>

<template>
  <router-view />
  <span v-loading.fullscreen.lock="fullscreenLoading" />
</template>

<style scoped>
</style>
