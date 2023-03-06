import Vue from 'vue'
import VueRouter from 'vue-router'

import auth from '@/services/middleware';
import log from '@/services/log';

import HomeView from '../views/pages/Home.vue'
import Modul from '../views/pages/Modul.vue'
import LoginUser from '../views/Login.vue'
import JadwalSa from '../views/pages/JadwalSA.vue'
import JadwalDev from '../views/pages/JadwalDev.vue'
import UserAdmin from '../views/pages/UserAdmin.vue'
import Pertanyaan from '../views/pages/Pertanyaan.vue'
import Pertanyaans from '../views/pages/Pertanyaans.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'login',
  //   component: LoginUser
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   // component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // },

  //All Role Menu
  {
    path: '/',
    redirect: 'home'
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: {
      middleware: [auth, log],
    },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginUser,
    meta: {
      middleware: log,
    },
  },

  //Role Admin
  {
    path: '/modul',
    name: 'modul',
    component: Modul,
    meta: {
      middleware: [auth, log],
    },
  },
  {
    path: '/userAdmin',
    name: 'userAdmin',
    component: UserAdmin,
    meta: {
      middleware: [auth, log],
    },
  },
  {
    path: '/Pertanyaans',
    name: 'Pertanyaans',
    component: Pertanyaans,
    meta: {
      middleware: [auth, log],
    },
  },

  //Role Dev
  {
    path: '/jadwalDev',
    name: 'jadwalDev',
    component: JadwalDev,
    meta: {
      middleware: [auth, log],
    },
  },

  //Role SA
  {
    path: '/jadwalSa',
    name: 'jadwalSa',
    component: JadwalSa,
    meta: {
      middleware: [auth, log],
    },
  },
  {
    path: '/Pertanyaan',
    name: 'Pertanyaan',
    component: Pertanyaan,
    meta: {
      middleware: [auth, log],
    },
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Creates a `nextMiddleware()` function which not only
// runs the default `next()` callback but also triggers
// the subsequent Middleware function.
function nextFactory(context, middleware, index) {
  const subsequentMiddleware = middleware[index];
  // If no subsequent Middleware exists,
  // the default `next()` callback is returned.
  if (!subsequentMiddleware) return context.next;

  return (...parameters) => {
    // Run the default Vue Router `next()` callback first.
    context.next(...parameters);
    // Then run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    subsequentMiddleware({ ...context, next: nextMiddleware });
  };
}

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware];

    const context = {
      from,
      next,
      router,
      to,
    };
    const nextMiddleware = nextFactory(context, middleware, 1);

    return middleware[0]({ ...context, next: nextMiddleware });
  }

  return next();
});

export default router
