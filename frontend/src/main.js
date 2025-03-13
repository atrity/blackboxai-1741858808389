import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor for JWT token
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // Handle token refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const response = await axiosInstance.post('/auth/refresh', { refreshToken })
        const { token } = response.data
        
        localStorage.setItem('token', token)
        originalRequest.headers.Authorization = `Bearer ${token}`
        
        return axiosInstance(originalRequest)
      } catch (err) {
        // If refresh token fails, redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        router.push('/login')
        return Promise.reject(err)
      }
    }
    return Promise.reject(error)
  }
)

// Create Vue app instance
const app = createApp(App)

// Global properties
app.config.globalProperties.$axios = axiosInstance
app.config.globalProperties.$toast = (message, type = 'info') => {
  // This will be implemented in App.vue
  app.config.globalProperties.$root.$emit('show-toast', { message, type })
}

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err)
  console.error('Vue instance:', vm)
  console.error('Error info:', info)
  
  // Show error toast
  app.config.globalProperties.$toast(
    'An unexpected error occurred. Please try again.',
    'error'
  )
}

// Use router
app.use(router)

// Mount app
app.mount('#app')

// Export axios instance for use in components
export { axiosInstance }
