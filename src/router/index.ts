import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import login from '@/views/userPage/login.vue';
import join from '@/views/userPage/join.vue';
import mainpage from '@/views/mainPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: login,
  },
  {
    path: '/join',
    component: join,
  },
  {
    path: '/mainpage',
    component: mainpage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
