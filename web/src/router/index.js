import { createRouter,
	createWebHashHistory } from 'vue-router'
import { getToken } from '../utils/util.js'
import { ElMessage } from 'element-plus'
import { userInfoStore } from '../store'
import { verify } from '../api/index.js'

const whiteList = ['/login',
	'/auth-redirect',
	'/register']

const routes = [
	{
		name: 'home',
		path: '/',
		component: () => import('../pages/Home.vue'),
		redirect: '/total',
		children: [
			{
				name: 'total',
				path: '/total',
				component: () =>
					import('../pages/Total.vue'),
				meta: { title: '首页' },
			},
			{
				name: 'personalResult',
				path: '/personal-result',
				component: () =>
					import('../pages/PersonalResult.vue'),
				meta: { title: '个人成绩' },
			},
			{
				name: 'advantageResult',
				path: '/advantage-result',
				component: () =>
					import('../pages/AdvantageResult.vue'),
				meta: { title: '平均成绩' },
			},
			{
				name: 'rank',
				path: '/rank',
				component: () =>
					import('../pages/Rank.vue'),
				meta: { title: '排名' },
			},
			{
				name: 'passRate',
				path: '/pass-rate',
				component: () =>
					import('../pages/PassRate.vue'),
				meta: { title: '及格情况' },
			},
			{
				name: 'resultRate',
				path: '/result-rate',
				component: () =>
					import('../pages/ResultRange.vue'),
				meta: { title: '分数段统计图' },
			},
			{
				name: 'resultInformation',
				path: '/result-information',
				component: () =>
					import(
						'../pages/student-information/index.vue'
					),
				meta: { title: '成绩信息' },
				redirect:
          '/result-information/upload-information',
				children: [{
					name: 'EditResult',
					path: 'edit-result',
					component: () =>
						import(
							'../pages/result-information/EditResult.vue'
						),
					meta: { title: '查看&编辑' },
				},
				{
					name: 'TimeResult',
					path: 'time-result',
					component: () =>
						import(
							'../pages/result-information/TimeResult.vue'
						),
					meta: { title: '考试次数/类型编辑' },
				},
				{
					name: 'UploadStudent',
					path: 'upload-result',
					component: () =>
						import(
							'../pages/result-information/UploadResult.vue'
						),
					meta: { title: '上传成绩' },
				}],
			},
			{
				name: 'studentInformation',
				path: '/student-information',
				component: () =>
					import(
						'../pages/student-information/index.vue'
					),
				meta: { title: '学生信息' },
				redirect:
          '/student-information/view-information',
				children: [{
					name: 'viewStudentInformation',
					path: 'view-information',
					component: () =>
						import(
							'../pages/student-information/StudentInformation.vue'
						),
					meta: { title: '查看&编辑' },
				},
				{
					name: 'studentInformationEdit',
					path: 'edit-information',
					component: () =>
						import(
							'../pages/student-information/StudentInformationEdit.vue'
						),
					meta: { title: '批量编辑' },
				},
				{
					name: 'uploadStudent',
					path: 'upload-information',
					component: () =>
						import(
							'../pages/student-information/UploadStudent.vue'
						),
					meta: { title: '上传学生信息' },
				}],
			},
		],
	},
	{
		name: 'login',
		path: '/login',
		component: () => import('../pages/Login.vue'),
		meta: { title: '登录页' },
	},
	{
		name: 'register',
		path: '/register',
		component: () =>
			import('../pages/Register.vue'),
		meta: { title: '注册' },
	},
	{
		path: '/404',
		name: '404',
		component: () =>
			import('../components/404.vue'),
	},
	{
		path: '/:pathMatch(.*)',
		redirect: '/404',
	},
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

router.beforeEach(async (to, from, next) => {
	document.title = to.meta.title
	const hasToken = getToken()
	const store = userInfoStore()
	const hasGetUserInfo = !!store.username
	// 是否第一次进入网页
	if (!hasGetUserInfo) {
		// 第一次进入网页
		// 是否有token
		if (hasToken) {
			// 有token
			const { username, role } = await verify(
				hasToken,
			)
			// 验证token
			if (username) {
				// 验证成功，存user进pinia，阻止login路由
				store.saveUserInfo(
					username,
					role,
					hasToken,
				)
				if (to.path === '/login') {
					next('/')
				} else {
					next()
				}
			} else {
				// 验证失败，跳转login
				if (whiteList.indexOf(to.path) !== -1) {
					next()
				} else {
					ElMessage.error('验证失败')
					next({
						path: '/login',
						query: { redirect: to.path },
					})
				}
			}
		} else {
			// 无token
			if (whiteList.indexOf(to.path) !== -1) {
				next()
			} else {
				// 跳转登录
				ElMessage.error('登录失效')
				next(`/login?redirect=${to?.path}`)
			}
		}
	} else {
		// 不是第一次进入网页
		if (hasToken) {
			// 有token
			if (to.path === '/login') {
				// 阻止进入login
				next('/')
			} else {
				next()
			}
		} else {
			// 无token
			if (whiteList.indexOf(to.path) !== -1) {
				next()
			} else {
				// 跳转登录
				ElMessage.error('验证失败')
				next(`/login?redirect=${to.path}`)
			}
		}
	}
})

export default router
