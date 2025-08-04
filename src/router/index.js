import { createRouter, createWebHashHistory } from 'vue-router'
import junoRoutes from '@/modules/juno/router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/courses',
    name: 'Courses',
    component: () => import('../views/CoursesView.vue')
  },
  {
    path: '/juno',
    ...junoRoutes
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
