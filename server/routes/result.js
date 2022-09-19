const router = require('koa-router')()
const utils = require('../utils/util')
const { getResult, getAdvantage } = require('../server/result')
const { getPerStudentMessage } = require('../server/student')

router.prefix('/result')

router.get('/studentResult', async (ctx, next) => {
  const { id } = ctx.request.query
  const result = await getResult(id)
  const information = await getPerStudentMessage(id)
  console.log(result)
  ctx.body = utils.success({ result, information })
})

router.post('/getAdvantage', async (ctx, next) => {
  const { grade, Class, testTime } = ctx.request.body
  console.log(testTime)
  const res = await getAdvantage(grade, Class, testTime)
  ctx.body = utils.success(res)
})

module.exports = router
