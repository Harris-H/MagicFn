import { createRouter, createWebHashHistory, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import About from '../views/About.vue'
import Suffix from '../views/Suffix.vue'
const routes = [
  {
    path: '/',
    component: Home,
    redirect: '/dashboard', // 重定向到 '/dashboard
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard, // 默认视图
      },
      {
        path: 'suffix',
        name: 'Suffix',
        component: Suffix,
      },
      {
        path: 'about',
        name: 'About',
        component: About, // 默认视图
      },
    ],
  },
];
const router = createRouter({
  history: window.electronEnv.IS_PROD_ENV?createWebHashHistory(window.electronEnv.BASE_URL):createWebHistory(window.electronEnv.BASE_URL),
  routes
})

export default router