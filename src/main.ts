import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import 'element-plus/theme-chalk/dark/css-vars.css';
import './demos/ipc'
import i18n from './locales';
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

createApp(App)
  .use(router) // 使用路由实例
  .use(i18n)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
