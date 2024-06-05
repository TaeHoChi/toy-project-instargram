import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import login from '@/views/login/login.vue';
import join from '@/views/login/join.vue';
import mainpage from '@/views/mainPage.vue';
import mainpageshow from '@/views/mainPageShow.vue';
import board from '@/views/board/board.vue';
import boardcreate from '@/views/board/boardCreate.vue';
import profile from '@/views/profile/profile.vue';
import profilemodify from '@/views/profile/profileModify.vue';
import profilecreate from '@/views/profile/profileCreate.vue';
import profileshow from '@/views/profile/profileShow.vue';
import boardmodify from '@/views/board/boardModify.vue';
import gptboard from '@/views/gptBoard.vue';

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
  {
    path: '/mainpage/show/:id',
    component: mainpageshow,
  },
  {
    path: '/board/create/:id',
    component: boardcreate,
  },
  {
    path: '/board/:id',
    component: board,
  },
  {
    path: '/board/modify/:id',
    component: boardmodify,
  },
  {
    path: '/profile/:id',
    component: profile,
  },
  {
    path: '/profile/create',
    component: profilecreate,
  },
  {
    path: '/profile/edit/:id',
    component: profilemodify,
  },
  {
    path: '/profile/show/:id',
    component: profileshow,
  },
  {
    path: '/gpt/board',
    component: gptboard,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
