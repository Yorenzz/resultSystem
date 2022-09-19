const router = require('koa-router')()
const utils = require('../utils/util')
const {getResult, getAdvantage} =require('../server/result')
const {getPerStudentMessage} = require('../server/student')

router.prefix('/result')

router.get('/getAdvantage', async (ctx, next) => {
    const { grade, Class, testTime = 1 } = ctx.request.query
    const res = await getAdvantage(grade, Class, testTime)
    ctx.body = utils.success(res)
  })
router.get('/studentResult', async (ctx, next) => {
    const { id } = ctx.request.query
    const result = await getResult(id)
    const information = await getPerStudentMessage(id)
    console.log(result)
    ctx.body = utils.success({ result, information })
})

module.exports = router