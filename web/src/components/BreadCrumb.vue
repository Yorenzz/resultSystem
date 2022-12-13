<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import storage from '../utils/storage'

const router = useRouter()
const route = useRoute()
const breadcrumb = ref(null)

const getBreadcrumb = () => {
	let matched = route.matched.filter(item => item.meta && item.meta.title)
	const first = matched[0]
	if (!isHomePage(first)) {
		matched = [{
			path: '/',
			meta: { title: '首页' },
		}].concat(matched)
	}
	breadcrumb.value = matched
}

const isHomePage = (route) => {
	return route?.name && route.name === 'total'
}
const exit = () => {
	storage.clearItem('XToken')
	router.push('/login')
}

watchEffect(() => {
	getBreadcrumb()
})
</script>

<template>
  <div class="bread">
    <el-breadcrumb separator="/">
      <template
        v-for="item in breadcrumb"
        :key="item.path"
      >
        <el-breadcrumb-item
          :to="item.path"
        >
          {{ item.meta.title }}
        </el-breadcrumb-item>
      </template>
    </el-breadcrumb>
    <el-button @click="exit">
      退出登录
    </el-button>
  </div>
</template>

<style scoped lang="scss">
	.bread {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-right: 32px;
	}
</style>
