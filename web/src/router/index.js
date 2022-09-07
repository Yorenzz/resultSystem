import {
  createRouter,
  createWebHashHistory,
} from 'vue-router'
import { getToken } from '../utils/util.js'
import { ElMessage } from 'element-plus'
import { userInfoStore } from '../store'
import { verify } from '../api/index.js'

const whiteList = [
  '/login',
  '/auth-redirect',
  '/register',
]

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
        meta: {
          title: '首页',
        },
      },
      {
        name: 'personalResult',
        path: '/personal-result',
        component: () =>
          import('../pages/PersonalResult.vue'),
        meta: {
          title: '个人成绩',
        },
      },
      {
        name: 'advantageResult',
        path: '/advantage-result',
        component: () =>
          import('../pages/AdvantageResult.vue'),
        meta: {
          title: '平均成绩',
        },
      },
      {
        name: 'rank',
        path: '/rank',
        component: () =>
          import('../pages/Rank.vue'),
        meta: {
          title: '排名',
        },
      },
      {
        name: 'passRate',
        path: '/pass-rate',
        component: () =>
          import('../pages/PassRate.vue'),
        meta: {
          title: '及格情况',
        },
      },
      {
        name: 'resultRate',
        path: '/result-rate',
        component: () =>
          import('../pages/ResultRange.vue'),
        meta: {
          title: '分数段统计图',
        },
      },
      {
        name: 'uploadResult',
        path: '/upload-result',
        component: () =>
          import('../pages/UploadResult.vue'),
        meta: {
          title: '上传成绩',
        },
      },
      {
        name: 'studentInformation',
        path: '/student-information',
        component: () =>
          import(
            '../pages/student-information/index.vue'
          ),
        meta: {
          title: '学生信息',
        },
        redirect:
          '/student-information/view-information',
        children: [
          {
            name: 'viewStudentInformation',
            path: 'view-information',
            component: () =>
              import(
                '../pages/student-information/StudentInformation.vue'
              ),
            meta: {
              title: '查看&编辑',
            },
          },
          {
            name: 'studentInformationEdit',
            path: 'edit-information',
            component: () =>
              import(
                '../pages/student-information/StudentInformationEdit.vue'
              ),
            meta: {
              title: '批量编辑',
            },
          },
        ],
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
    name: 'register',
    path: '/register',
    component: () =>
      import('../pages/Register.vue'),
    meta: {
      title: '注册',
    },
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
  if (store.isFirst === 1) {
    if (hasToken) {
      const { username, role } = await verify(
        hasToken,
      )
      if (username) {
        store.saveUserInfo(username, role)
        if (to.path === '/login') {
          next('/')
        } else {
          next()
        }
      } else {
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
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        ElMessage.error('登录失效')
        next(`/login?redirect=${to.path}`)
      }
    }
    store.isFirst++
  } else {
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
        ElMessage.error('验证失败')
        next(`/login?redirect=${to.path}`)
      }
    }
  }
})

export default router
