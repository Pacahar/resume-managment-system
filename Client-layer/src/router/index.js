import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'Home', component: () => import('@/pages/Home.vue') },
  { path: '/login', name: 'Login', component: () => import('@/pages/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('@/pages/Register.vue') },

  { path: '/resumes', name: 'Resumes', component: () => import('@/pages/Resumes.vue'), meta: { requiresAuth: true }, },
  { path: '/resumes/new', component: () => import('@/components/ResumeForm.vue'), meta: { requiresAuth: true }, },
  { path: '/resumes/:id/edit', component: () => import('@/components/ResumeForm.vue'), props: true,  meta: { requiresAuth: true }, },


  { path: '/jobs', name: 'Jobs', component: () => import('@/pages/Jobs.vue') },
  { path: "/jobs/new", name: "JobCreate", component: () => import("@/components/JobForm.vue"), meta: { requiresAuth: true } },
  { path: "/jobs/:id/edit", name: "JobEdit", component: () => import("@/components/JobForm.vue"), props: true, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Глобальный перехватчик маршрутов
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); 

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
