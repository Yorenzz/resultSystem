const router = require('koa-router')()
const utils = require('../utils/util')
const {
  getResult,
  getAdvantage,
  getPerAdvantageByGrade,
  getResultRank,
  insertStudentResult, getInitialNumber, getActualNumber, getAdvantageBySubject,
} = require('../server/result')
const { getPerStudentMessage } = require('../server/student')

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

module.exports = router
