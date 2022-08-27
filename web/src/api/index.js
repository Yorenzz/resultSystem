import request from '../utils/request.js'

export const test=()=>{
	return request({
		methods: 'GET',
		url: '/test',
		data: {
			name: 'yorenz',
			password: '123456'
		}
	})
}
