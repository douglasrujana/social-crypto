import { createRouter, createWebHashHistory } from 'vue-router'
import junoRoutes from '@/modules/juno/router'

// Rutas organizadas por módulos, cada módulo tiene su archivo de rutas
const routes = [
  {
    path: '/',
    name: 'Home',
    // Componente lazy-loaded, renderizado solo cuando se accede a la ruta
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/courses',
    name: 'Courses',
    // Componente lazy-loaded, renderizado solo cuando se accede a la ruta
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
