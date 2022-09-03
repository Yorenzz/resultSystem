<script setup >
import { SUBJECT_TRANSLATE } from '../constant/index.js'

const props = defineProps({
	subject: {
		type: String,
		default: '',
	},
	score: {
		type: Number,
		default: null,
	}
})
</script >

<template >
    <el-card
			class="score-card"
			v-if="props.score"
		>
			<div>{{ SUBJECT_TRANSLATE[props.subject] }}</div>
			<div>{{ props.score }}</div>
    </el-card>
</template >

<style scoped lang="scss">
.score-card {
	width: 150px;
	height: 150px;
	margin-right: 16px;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style >
