const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const cors = require('koa2-cors')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const jwt = require('koa-jwt')
const index = require('./routes/index')
const users = require('./routes/users')
const student = require('./routes/student')
const result = require('./routes/result')
const util = require('./utils/util')
const log4js = require('./utils/log4j')
const koaBody = require('koa-body')
// error handler
onerror(app)

app.use(cors())
// middlewares
// app.use(
//   bodyparser({
//     enableTypes: ['json', 'form', 'text'],
//   }),
// )
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(
	koaBody({
		multipart: true,
		formidable: { maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
		},
	}),
)
app.use(
	views(__dirname + '/views', { extension: 'pug' }),
)

// logger
app.use(async (ctx, next) => {
	// log4js.info(`get params:${JSON.stringify(ctx.request.query)}`)
	// log4js.info(`post params:${JSON.stringify(ctx.request.body)}`)
	await next().catch(err => {
		if (err.status === 401) {
			ctx.status = 200
			ctx.body = util.fail('登录失效', '', util.CODE.AUTH_ERROR)
		} else {
			throw err
		}
	})
})

app.use(
	jwt({ secret: 'Yorenz' }).unless({
		path: [
			/^\/users\/login/,
			/^\/users\/register/,
			/^\/student\/downloadStudentTemplate/,
		],
	}),
)

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(student.routes(), student.allowedMethods())
app.use(result.routes(), result.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
	console.error('server error', err, ctx)
})

module.exports = app
