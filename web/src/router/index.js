import { createRouter, createWebHashHistory } from 'vue-router'
import { getToken } from '../utils/util.js'

const whiteList = ['/login', '/auth-redirect']

const routes = [
    {
        name: 'home',
        path: '/',
        component: () => import('../pages/Home.vue'),
        meta: {
            title: '首页',
        },
        redirect: '/total',
        children: [
            {
                name: 'total',
                path: '/total',
                component: () => import('../pages/Total.vue'),
                meta: {
                    title: '总览',
                },
            },
            {
                name: 'personalResult',
                path: '/personal-result',
                component: () => import('../pages/PersonalResult.vue'),
                meta: {
                    title: '个人成绩',
                },
            },
            {
                name: 'advantageResult',
                path: '/advantage-result',
                component: () => import('../pages/AdvantageResult.vue'),
                meta: {
                    title: '平均成绩',
                },
            },
            {
                name: 'rank',
                path: '/rank',
                component: () => import('../pages/Rank.vue'),
                meta: {
                    title: '排名',
                },
            },
            {
                name: 'passRate',
                path: '/pass-rate',
                component: () => import('../pages/PassRate.vue'),
                meta: {
                    title: '及格情况',
                },
            },
            {
                name: 'resultRate',
                path: '/result-rate',
                component: () => import('../pages/ResultRange.vue'),
                meta: {
                    title: '分数段统计图',
                },
            },
            {
                name: 'uploadResult',
                path: '/upload-result',
                component: () => import('../pages/UploadResult.vue'),
                meta: {
                    title: '上传成绩',
                },
            },
            {
                name: 'studentInformation',
                path: '/student-information',
                component: () => import('../pages/StudentInformation.vue'),
                meta: {
                    title: '管理学生信息',
                },
            },
        ],
    },
    {
        name: 'login',
        path: '/login',
        component: () => import('../pages/Login.vue'),
        meta: {
            title: '登录页',
        },
    },
    {
        path: '/404',
        name: '404',
        component: () => import('../components/404.vue'),
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

router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    const hasToken = getToken()
    if (hasToken) {
        if (to.path === '/login') {
            next('/')
        } else {
            next()
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
        }
    }
})

export default router
