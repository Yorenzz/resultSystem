const router = require('koa-router')()
const utils = require('../utils/util')
const {
	getResult,
	getAdvantage,
	getPerAdvantageByGrade,
	getResultRank,
	insertStudentResult, getInitialNumber, getActualNumber, getAdvantageBySubject, getEstScore,
	getGoodNum,
	getPassNum,
	getScoreRange,
} = require('../server/result')
const { getPerStudentMessage } = require('../server/student')
const {
	FULL_SCORE_RANGE,
	TOTAL_SCORE_RANGE_TWO,
	TOTAL_SCORE_RANGE_THREE,
	TOTAL_SCORE_RANGE_ONE,
	SCORE_RANGE,
} = require('../config')

router.prefix('/result')

router.get('/studentResult', async (ctx, next) => {
	const { id } = ctx.request.query
	const result = await getResult(id)
	const information = await getPerStudentMessage(id)
	ctx.body = utils.success({ result, information })
})

router.post('/getAdvantage', async (ctx, next) => {
	const { grade, Class, testTime } = ctx.request.body
	const res = await getAdvantage(grade, Class, testTime)
	// console.log(res)
	ctx.body = utils.success(res)
})

router.post('/getAdvantageBySubject', async (ctx, next) => {
	const { grade, Class, subject, testTime } = ctx.request.body
	const res = await getAdvantageBySubject(grade, Class, subject, testTime)
	ctx.body = utils.success(res)
})

router.post('/getPerAdvantage', async (ctx, next) => {
	const { grade, testTime } = ctx.request.body
	const res = await getPerAdvantageByGrade(grade, testTime)
	ctx.body = utils.success(res)
})

router.post('/getResultRank', async (ctx, next) => {
	const { grade, Class, subject } = ctx.request.body
	const res = await getResultRank(grade, Class, subject)
	ctx.body = utils.success(res)
})

router.post('/getResultRank', async (ctx, next) => {
	const { grade, Class, subject } = ctx.request.body
	const res = await getResultRank(grade, Class, subject)
	ctx.body = utils.success(res)
})

router.post('/insertStudentResult', async (ctx, next) => {
	const { data } = ctx.request.body
	const res = await insertStudentResult(data)
	console.log(res)
	ctx.body = utils.success(res, '上传成功')
	// ctx.body = utils.success(res)
})

router.post('/statisticNumber', async (ctx, next) => {
	const { grade, Class, subject } = ctx.request.body
	console.log(grade, Class, subject)
	const initialNumber = await getInitialNumber(grade, Class)
	const actualNumber = await getActualNumber(grade, Class, subject)
	// console.log(res)
	ctx.body = utils.success({ initialNumber: initialNumber.num, actualNumber: actualNumber.num })
	// ctx.body = utils.success(res)
})

router.post('/getHighestScore', async (ctx, next) => {
	const { grade, Class, subject, flag } = ctx.request.body
	console.log(grade, Class, subject, flag)
	const { num } = await getEstScore(flag, grade, Class, subject)
	// console.log(res)
	ctx.body = utils.success({ num })
	// ctx.body = utils.success(res)
})

router.post('/getGoodRate', async (ctx, next) => {
	const { grade, Class, subject } = ctx.request.body
	const { num } = await getGoodNum(grade, Class, subject)
	// console.log(res)
	ctx.body = utils.success(num)
	// ctx.body = utils.success(res)
})

router.post('/getPassRate', async (ctx, next) => {
	const { grade, Class, subject } = ctx.request.body
	const { num } = await getPassNum(grade, Class, subject)
	// console.log(res)
	ctx.body = utils.success(num)
	// ctx.body = utils.success(res)
})

router.post('/getScoreRange', async (ctx, next) => {
	const { grade, Class, subject } = ctx.request.body
	let range = null
	switch (subject) {
	case 'Chinese':
		range = FULL_SCORE_RANGE
		break
	case 'English':
		range = FULL_SCORE_RANGE
		break
	case 'Math':
		range = FULL_SCORE_RANGE
		break
	case 'Total':
		if (grade === 1) { range = TOTAL_SCORE_RANGE_ONE } else if (grade === 2) { range = TOTAL_SCORE_RANGE_TWO } else if (grade === 3) { range = TOTAL_SCORE_RANGE_THREE }
		break
	default:
		range = SCORE_RANGE
	}
	console.log(range)
	const arr = await Promise.all(range.map(async (item) => {
		return getScoreRange(item, grade, Class, subject)
	}))
	console.log(arr)
	ctx.body = utils.success(arr.map(item => item.num))
	// ctx.body = utils.success(res)
})

module.exports = router
