<script setup>
import { SUBJECT_TRANSLATE,
	GRADE_SUBJECT } from '../constant/index.js'
import { computed } from 'vue'

const props = defineProps({
	subject: {
		type: String,
		default: '',
	},
	score: {
		type: Number,
		default: null,
	},
	msg: {
		type: Object,
		default: () => {},
	},
})

const gradeSubject = computed(() => {
	return GRADE_SUBJECT[props.msg.Grade]
})
</script>

<template>
  <el-card
    class="score-card"
    v-if="
      gradeSubject.indexOf(props.subject) !== -1
    "
  >
    <div>
      {{
        SUBJECT_TRANSLATE[props.subject]
      }}
    </div>
    <div>
      {{
        props.score ? props.score : '--'
      }}
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.score-card {
  width: 150px;
  height: 150px;
  margin-right: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
