const router = require('koa-router')()

const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({ apiKey: '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' })

router.post('/chat', async (ctx, next) => {
	const { question } = ctx.request.body
	const openai = new OpenAIApi(configuration)
	const response = await openai.createCompletion({
		model: 'text-davinci-003',
		prompt: `${question}`,
		max_tokens: 2048,
		temperature: 0.7,
		stop: [' Human:', ' AI:'],
	})
	const res = response.data
	ctx.body = res
})
module.exports = router
