import { createRouter, createWebHistory } from 'vue-router'
import GoalsView from '../views/GoalsView.vue'

const routes = [
  {
    path: '/',
    name: 'Goals',
    component: GoalsView
  },
  {
    path: '/goal/:id',
    name: 'GoalDetail',
    component: () => import('../views/GoalDetailView.vue'),
    props: true
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('../views/StatisticsView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router