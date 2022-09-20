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
function useTable(app) {
  app.use(VXETable)

  // 给 vue 实例挂载内部对象，例如：
  // app.config.globalProperties.$XModal = VXETable.modal
  // app.config.globalProperties.$XPrint = VXETable.print
  // app.config.globalProperties.$XSaveFile = VXETable.saveFile
  // app.config.globalProperties.$XReadFile = VXETable.readFile
}
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(useTable)
app.use(ElementPlus)
for (const [key, component] of Object.entries(
  ElementPlusIconsVue,
)) {
  app.component(key, component)
}

app.use(router)
app.mount('#app')
