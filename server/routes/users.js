const { Login, Register, isHaveUsername } = require('../server/user')
const md5 = require('md5')
const utils = require('../utils/util')
const jwt = require('jsonwebtoken')

const router = require('koa-router')()

router.prefix('/users')

router.post('/login', async function (ctx, next) {
	// console.log(ctx.request.body)
	const { username, password } = ctx.request.body
	const res = await Login(username, md5(password))
	const data = { username: res[0].username, role: res[0].role }
	// console.log(res)
	if (res && res.length) {
		data.token = jwt.sign(
			{ res },
			'Yorenz',
			{ expiresIn: '20h' },
		)
		ctx.body = utils.success(data, '登录成功')
	} else {
		ctx.body = utils.fail('用户名或密码错误')
	}
})

router.get('/verify', async (ctx, next) => {
	const { token } = ctx.request.query
	const res = {
		username: '',
		role: '',
	}
	jwt.verify(token, 'Yorenz', (err, data) => {
		if (err) {
			console.log('e', err)
		} else {
			// console.log(data, 'data');
			res.username = data.res[0].username
			res.role = data.res[0].role
		}
	})
	ctx.body = utils.success(res)
})

router.post('/register', async function (ctx, next) {
	// console.log(ctx.request.body)
	const { username, password } = ctx.request.body
	const isHave = await isHaveUsername(username)
	if (isHave[0].isHave) {
		ctx.body = utils.fail('用户名已存在！')
	} else {
		const res = await Register(username, md5(password))
		// console.log(res)
		ctx.body = utils.success(res, '注册成功！请点击按钮返回登录...')
	}
})

module.exports = router
