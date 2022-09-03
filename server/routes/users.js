const { Login, Register } = require('../server/user')
const md5 = require('md5')
const utils = require('../utils/util')
const jwt = require('jsonwebtoken')

const router = require('koa-router')()

router.prefix('/users')

router.post('/login', async function (ctx, next) {
  console.log(ctx.request.body)
  const { username, password } = ctx.request.body
  const res = await Login(username, md5(password))
  const data = { username: res[0].username, role: res[0].role }
  console.log(res)
  if (res && res.length) {
    data.token = jwt.sign(
      {
        res,
      },
      'Yorenz',
      { expiresIn: '24h' },
    )
    ctx.body = utils.success(data, '登录成功')
  } else {
    ctx.body = utils.fail('用户名或密码错误')
  }
})

router.post('/register', async function (ctx, next) {
  console.log(ctx.request.body)
  const { username, password } = ctx.request.body
  const res = await Register(username, md5(password))
  console.log(res)
  ctx.body = res
})

module.exports = router
