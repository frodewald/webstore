/* eslint-disable no-unused-vars */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Product from '../views/product/Index.vue'
import ProductDetail from '../views/product/Detail.vue'
import Cart from '../views/cart/Index.vue'
import Register from '@/views/auth/register.vue'
import Login from '@/views/auth/login.vue'
import NotFound from '../views/errors/404.vue'
import Profile from '@/views/profile/Index.vue'
import Home from '@/views/home/index.vue'
import Checkout from '@/views/checkout/index.vue'
import AllCategories from '@/views/categories/AllCategories.vue'
import statusPesanan from '@/views/status-pesanan/index.vue'
import { SESSION_API_ENDPOINTS } from '@/services/api'
import axios from 'axios'

// admin
import AdminDashboard from '@/views/admin/adminDashboard/Index.vue'
import EditProduct from '@/views/admin/adminDashboard/EditProduct.vue'
import CreateProduct from '@/views/admin/adminDashboard/CreateProduct.vue'


Vue.use(VueRouter)

const checkAuth = async (to, from, next) => {
  try {
    const { data } = await axios.get(SESSION_API_ENDPOINTS.checkSession, {
      withCredentials: true,
    });

    to.meta.userRole = data.role; // Simpan role di meta route
    console.log(data.role)
    if (data.authenticated) {
      // Jika pengguna sudah terautentikasi
      if(to.path === '/login' || to.path === '/register') {
        return next('/') 
      }
      // Jika semua kondisi lain terpenuhi, lanjutkan ke halaman yang diminta
      return next();
    } else {
      // Hanya arahkan ke login jika bukan halaman login atau register
      if (to.path !== '/login' && to.path !== '/register') {
        return next('/login');
      }
      next(); // Biarkan akses ke halaman login/register
    }
  } catch (error) {
    console.error('Failed to check session:', error);
    next('/login'); // Redirect ke login jika terjadi error
  }
};

const requireRole = (role) => (to, from, next) => {
  const userRole = to.meta.userRole;
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && userRole !== role) {
    return next({ path: '/', replace: true });
  }
  next();
};


const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/products',
    name: 'product',
    component: Product,
  },
  {
    path: '/product/:id',
    name: 'product-detail',
    component: ProductDetail,
  },
  {
    path: '/categories',
    name: 'categories',
    component: AllCategories,
  },
  {
    path: '/cart',
    name: 'cart',
    component: Cart,
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: Checkout
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
  },
  {
    path: '/status',
    name: 'status',
    component: statusPesanan
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' }, // Menambahkan meta untuk autentikasi dan role
  },
  {
    path: '/admin/products/create',
    name: 'create-product',
    component: CreateProduct,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/products/update/:id',
    name: 'update-product',
    component: EditProduct,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '*',
    component: NotFound,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  await checkAuth(to, from, next); // Panggil fungsi autentikasi
  if (to.meta.requiresAuth) {
    requireRole(to.meta.role)(to, from, next); // Panggil fungsi pemeriksaan role
  } else {
    next(); // Lanjutkan jika tidak memerlukan autentikasi
  }
});

export default router
