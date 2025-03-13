<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <span class="text-2xl font-bold text-primary-600">
              <i class="fas fa-cube mr-2"></i>
              SubsManager
            </span>
          </div>

          <!-- Navigation Links -->
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <router-link 
              v-for="item in navItems" 
              :key="item.path"
              :to="item.path"
              class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
              :class="$route.path === item.path ? 'text-primary-600' : 'text-gray-600'"
            >
              <i :class="item.icon + ' mr-2'"></i>
              {{ item.name }}
            </router-link>
          </div>

          <!-- Mobile Menu Button -->
          <div class="flex items-center sm:hidden">
            <button 
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              <i :class="mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
            </button>
          </div>

          <!-- User Menu -->
          <div class="hidden sm:flex items-center">
            <button class="p-2 rounded-full hover:bg-gray-100 relative">
              <i class="fas fa-bell text-gray-600"></i>
              <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 transform translate-x-1/2 -translate-y-1/2"></span>
            </button>
            <div class="ml-3 relative">
              <button 
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
              >
                <img 
                  class="h-8 w-8 rounded-full" 
                  src="https://ui-avatars.com/api/?name=John+Doe" 
                  alt="User avatar"
                >
                <span class="text-sm font-medium text-gray-700">John Doe</span>
                <i class="fas fa-chevron-down text-xs text-gray-500"></i>
              </button>

              <!-- User Dropdown Menu -->
              <div 
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
              >
                <div class="py-1">
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i class="fas fa-user mr-2"></i> Profile
                  </a>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i class="fas fa-cog mr-2"></i> Settings
                  </a>
                  <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    <i class="fas fa-sign-out-alt mr-2"></i> Sign out
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Navigation Menu -->
        <div 
          v-if="mobileMenuOpen"
          class="sm:hidden"
        >
          <div class="pt-2 pb-3 space-y-1">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
              :class="$route.path === item.path ? 'text-primary-600' : 'text-gray-600'"
              @click="mobileMenuOpen = false"
            >
              <i :class="item.icon + ' mr-2'"></i>
              {{ item.name }}
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view v-slot="{ Component }">
        <transition 
          name="fade" 
          mode="out-in"
          enter-active-class="transition-opacity duration-200"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Global Modal -->
    <transition name="modal">
      <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div 
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
            @click="closeModal"
          ></div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div 
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            @click.stop
          >
            <slot name="modal"></slot>
          </div>
        </div>
      </div>
    </transition>

    <!-- Global Toast Notifications -->
    <div class="fixed bottom-0 right-0 p-6 z-50">
      <transition-group name="list" tag="div" class="space-y-2">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3"
          :class="{
            'border-l-4 border-green-500': toast.type === 'success',
            'border-l-4 border-red-500': toast.type === 'error',
            'border-l-4 border-blue-500': toast.type === 'info'
          }"
        >
          <i 
            class="text-2xl"
            :class="{
              'fas fa-check-circle text-green-500': toast.type === 'success',
              'fas fa-times-circle text-red-500': toast.type === 'error',
              'fas fa-info-circle text-blue-500': toast.type === 'info'
            }"
          ></i>
          <p class="text-gray-600">{{ toast.message }}</p>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      mobileMenuOpen: false,
      userMenuOpen: false,
      showModal: false,
      toasts: [],
      navItems: [
        { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-chart-line' },
        { name: 'Subscriptions', path: '/subscriptions', icon: 'fas fa-sync' },
        { name: 'Customers', path: '/customers', icon: 'fas fa-users' },
        { name: 'Invoices', path: '/invoices', icon: 'fas fa-file-invoice' },
        { name: 'Reports', path: '/reports', icon: 'fas fa-chart-bar' },
      ]
    }
  },
  methods: {
    closeModal() {
      this.showModal = false;
    },
    showToast(message, type = 'info', duration = 3000) {
      const toast = {
        id: Date.now(),
        message,
        type
      };
      this.toasts.push(toast);
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== toast.id);
      }, duration);
    }
  },
  watch: {
    $route() {
      // Close mobile menu when route changes
      this.mobileMenuOpen = false;
      this.userMenuOpen = false;
    }
  }
}
</script>

<style>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
