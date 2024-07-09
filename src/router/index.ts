import { createRouter, createWebHashHistory, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import HelloWorld from '../views/HelloWorld.vue'
import Dashboard from '../views/Dashboard.vue'
import About from '../views/About.vue'
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
        path: 'about',
        name: 'About',
        component: About, // 默认视图
      },
      {
        path: 'hello-world',
        name: 'HelloWorld',
        component: HelloWorld,
      },
    ],
  },
];
const router = createRouter({
  history: window.electronEnv.IS_PROD_ENV?createWebHashHistory(window.electronEnv.BASE_URL):createWebHistory(window.electronEnv.BASE_URL),
  routes
})

export default router