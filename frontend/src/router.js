import { createRouter, createWebHistory } from 'vue-router'

// Lazy-loaded route components
const Dashboard = () => import('./components/Dashboard.vue')
const SubscriptionManagement = () => import('./components/SubscriptionManagement.vue')
const CustomerPortal = () => import('./components/CustomerPortal.vue')
const InvoiceGenerator = () => import('./components/InvoiceGenerator.vue')
const Reports = () => import('./components/Reports.vue')
const Login = () => import('./components/Login.vue')
const Register = () => import('./components/Register.vue')

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { public: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { public: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { 
      requiresAuth: true,
      title: 'Dashboard',
      description: 'View your business insights and analytics'
    }
  },
  {
    path: '/subscriptions',
    name: 'Subscriptions',
    component: SubscriptionManagement,
    meta: { 
      requiresAuth: true,
      title: 'Subscription Management',
      description: 'Manage your subscription plans and pricing'
    }
  },
  {
    path: '/customers',
    name: 'Customers',
    component: CustomerPortal,
    meta: { 
      requiresAuth: true,
      title: 'Customer Portal',
      description: 'Manage your customers and their subscriptions'
    }
  },
  {
    path: '/invoices',
    name: 'Invoices',
    component: InvoiceGenerator,
    meta: { 
      requiresAuth: true,
      title: 'Invoice Generator',
      description: 'Generate and manage invoices'
    }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: { 
      requiresAuth: true,
      title: 'Reports',
      description: 'View detailed reports and analytics'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('./components/NotFound.vue'),
    meta: { public: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isPublic = to.matched.some(record => record.meta.public)
  const isAuthenticated = localStorage.getItem('token')

  // Update document title
  document.title = to.meta.title 
    ? `${to.meta.title} - SubsManager`
    : 'SubsManager'

  // Handle authentication
  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (isAuthenticated && (to.path === '/login' || to.path === '/register')) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
