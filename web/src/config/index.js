const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
	dev: {
		baseApi: 'https://www.fastmock.site/mock/9c9e43bcf55e4e696dcff8ef119cedb6/resultSystem',
	},
	prod: {
		baseApi: '/',
	}
}

export default {
	env,
	mock: false,
	...EnvConfig[env]
}
