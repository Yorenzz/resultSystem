<script setup>
import { ref } from 'vue'

const collaspe=ref(false)
</script>

<template>
	<el-menu
			default-active="1"
			class="el-menu-left"
			background-color="#545c64"
			text-color="#fff"
			:collapse="collaspe"
			active-text-color="#ffd04b"
	>
		<el-menu-item index="1">
				<el-icon><location /></el-icon>
				<span>首页</span>
		</el-menu-item>
		<el-menu-item index="2">
			<el-icon><Menu /></el-icon>
			<template #title>个人成绩</template>
		</el-menu-item>
		<el-menu-item index="3">
			<el-icon><document /></el-icon>
			<template #title>平均成绩</template>
		</el-menu-item>
		<el-menu-item index="4">
			<el-icon><setting /></el-icon>
			<template #title>成绩排名</template>
		</el-menu-item>
		<el-menu-item index="5">
			<el-icon><setting /></el-icon>
			<template #title>统计</template>
		</el-menu-item>
		<el-menu-item index="6">
			<el-icon><setting /></el-icon>
			<template #title>分数段条形图</template>
		</el-menu-item>
		<el-menu-item index="7">
			<el-icon><setting /></el-icon>
			<template #title>上传成绩信息</template>
		</el-menu-item>
		<el-menu-item index="8">
			<el-icon><setting /></el-icon>
			<template #title>管理学生信息</template>
		</el-menu-item>
		<div>
			<el-button link class="collapse-button" @click="collaspe=!collaspe">
				<el-icon :size="30">
					<ArrowLeft v-if="!collaspe"/>
					<ArrowRight v-if="collaspe"/>
				</el-icon>
			</el-button>
		</div>

	</el-menu>
</template>

<style scoped lang="scss">
.el-menu-left {
	height: 100%;
	border: none;
	padding-right: 16px;
	display: flex;
	flex-direction: column;
	.collapse-button {
		flex: 1;
		width: 100%;
		height: 50px;
		background: #545c64;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		padding-left: 16px;
	}
}
</style>
