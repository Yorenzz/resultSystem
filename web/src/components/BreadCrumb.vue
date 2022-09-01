<script setup>
import { useRouter } from 'vue-router';
import storage from '../utils/storage';

const router = useRouter()
const exit = () => {
	storage.clearItem('XToken')
	router.push('/login')
}
</script>

<template>
	<div class="bread">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
			<el-breadcrumb-item
			><a href="/">promotion management</a></el-breadcrumb-item
			>
			<el-breadcrumb-item>promotion list</el-breadcrumb-item>
			<el-breadcrumb-item>promotion detail</el-breadcrumb-item>
		</el-breadcrumb>
		<el-button @click="exit">退出登录</el-button>
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
