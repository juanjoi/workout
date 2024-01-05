import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Workout',
    component: () => import('@/components/Workout.vue'),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
