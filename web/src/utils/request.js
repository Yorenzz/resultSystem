import axios from 'axios'
import config from '../config/index.js'
import { ElMessage } from 'element-plus'
import router from '../router/index.js'

const service = axios.create({
	baseURL: config.baseApi,
	timeout: 8000,
})

service.interceptors.request.use((req)=>{
	// TODO
	const headers = req.headers
	if(!headers.Authorization)
		headers.Authorization = 'Bear Jack'
	return req;
})

service.interceptors.response.use((res)=>{
	const { code, data, msg }=res.data
	if(code === 200){
		return data
	}else if(code === 40001){
		ElMessage.error(msg)
		setTimeout(()=>{
			router.push('/login').then(r => {})
		})
		return Promise.reject(msg)
	}else {
		ElMessage.error(msg || '异常')
		return Promise.reject(msg || '异常')
	}
})

const request=(options)=>{
	options.method=options.method || 'get'
	if(options.method.toLowerCase() === 'get'){
		options.params=options.data
	}
	return service(options)
}

export default request
