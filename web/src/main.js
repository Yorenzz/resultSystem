import { createApp } from 'vue'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import './common/echartsUse'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(VXETable)
app.use(ElementPlus, { locale: zhCn })
for (const [key, component] of Object.entries(
	ElementPlusIconsVue,
)) {
	app.component(key, component)
}

app.use(router)
app.mount('#app')
