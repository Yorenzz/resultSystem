const router = require('koa-router')()
const { getStudent } = require('../server/student')
const utils = require('../utils/util')
router.prefix('/student')

router.get('/getStudentInformation', async function (ctx, next) {
    const res = await getStudent()
    console.log(res instanceof Array)
    ctx.body = utils.success(res)
})

module.exports = router