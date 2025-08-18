import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/views/OrdersPage.vue')
  },
  {
    path: '/incomes',
    name: 'incomes',
    component: () => import('@/views/IncomesPage.vue')
  },
  {
    path: '/sales',
    name: 'sales',
    component: () => import('@/views/SalesPage.vue')
  },
  {
    path: '/stocks',
    name: 'stocks',
    component: () => import('@/views/StocksPage.vue')
  },
  {
    path: '/',
    redirect: '/orders' // Перенаправление на страницу заказов
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
