<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500">Overview of your subscription business</p>
      </div>
      <div class="flex space-x-3">
        <button class="btn-outline">
          <i class="fas fa-download mr-2"></i>
          Export
        </button>
        <button class="btn-primary">
          <i class="fas fa-plus mr-2"></i>
          New Subscription
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.name" 
           class="bg-white rounded-lg shadow-sm p-6 transition-transform hover:transform hover:scale-105">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ stat.name }}</p>
            <p class="mt-1 text-2xl font-semibold text-gray-900">
              {{ stat.value }}
            </p>
          </div>
          <div :class="'text-' + stat.color + '-500'">
            <i :class="stat.icon + ' text-2xl'"></i>
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <span :class="'text-' + (stat.trend > 0 ? 'green' : 'red') + '-500'">
            <i :class="stat.trend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            {{ Math.abs(stat.trend) }}%
          </span>
          <span class="ml-2 text-sm text-gray-500">vs last month</span>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Revenue Chart -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-medium text-gray-900">Revenue Overview</h3>
        <div class="mt-4 h-72 relative">
          <!-- Placeholder for chart -->
          <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
          <canvas v-else ref="revenueChart"></canvas>
        </div>
      </div>

      <!-- Subscription Growth -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-medium text-gray-900">Subscription Growth</h3>
        <div class="mt-4 h-72 relative">
          <!-- Placeholder for chart -->
          <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
          <canvas v-else ref="growthChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div class="border-t border-gray-200">
        <ul class="divide-y divide-gray-200">
          <li v-for="activity in recentActivity" :key="activity.id" 
              class="p-6 hover:bg-gray-50 transition-colors">
            <div class="flex items-center space-x-4">
              <div :class="'rounded-full p-2 ' + activity.iconBg">
                <i :class="activity.icon + ' text-white'"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">
                  {{ activity.title }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ activity.description }}
                </p>
              </div>
              <div class="text-sm text-gray-500">
                {{ activity.time }}
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="p-6 border-t border-gray-200">
        <button class="text-primary-600 hover:text-primary-700 font-medium">
          View all activity
          <i class="fas fa-arrow-right ml-2"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

export default {
  name: 'Dashboard',
  setup() {
    const loading = ref(true)
    const revenueChart = ref(null)
    const growthChart = ref(null)

    const stats = [
      {
        name: 'Total Revenue',
        value: '$48,560',
        icon: 'fas fa-dollar-sign',
        color: 'green',
        trend: 12
      },
      {
        name: 'Active Subscriptions',
        value: '2,345',
        icon: 'fas fa-users',
        color: 'blue',
        trend: 8
      },
      {
        name: 'Churn Rate',
        value: '2.3%',
        icon: 'fas fa-chart-line',
        color: 'red',
        trend: -0.5
      },
      {
        name: 'MRR',
        value: '$12,450',
        icon: 'fas fa-sync',
        color: 'purple',
        trend: 15
      }
    ]

    const recentActivity = [
      {
        id: 1,
        title: 'New subscription',
        description: 'Tech Corp subscribed to Enterprise Plan',
        icon: 'fas fa-plus',
        iconBg: 'bg-green-500',
        time: '5 min ago'
      },
      {
        id: 2,
        title: 'Payment received',
        description: 'Received $599 from Acme Inc',
        icon: 'fas fa-dollar-sign',
        iconBg: 'bg-blue-500',
        time: '2 hours ago'
      },
      {
        id: 3,
        title: 'Plan upgraded',
        description: 'StartUp LLC upgraded to Pro Plan',
        icon: 'fas fa-arrow-up',
        iconBg: 'bg-purple-500',
        time: '4 hours ago'
      },
      {
        id: 4,
        title: 'Trial started',
        description: 'New trial started for Innovation Co',
        icon: 'fas fa-clock',
        iconBg: 'bg-yellow-500',
        time: '6 hours ago'
      }
    ]

    onMounted(() => {
      // Initialize Revenue Chart
      const revenueCtx = revenueChart.value.getContext('2d')
      new Chart(revenueCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Revenue',
            data: [30000, 35000, 32000, 40000, 45000, 48000],
            borderColor: '#0EA5E9',
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(14, 165, 233, 0.1)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: value => '$' + value.toLocaleString()
              }
            }
          }
        }
      })

      // Initialize Growth Chart
      const growthCtx = growthChart.value.getContext('2d')
      new Chart(growthCtx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'New Subscriptions',
            data: [150, 200, 180, 250, 300, 280],
            backgroundColor: '#8B5CF6'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })

      loading.value = false
    })

    return {
      loading,
      revenueChart,
      growthChart,
      stats,
      recentActivity
    }
  }
}
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 
         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 
         transition-colors font-medium;
}

.btn-outline {
  @apply px-4 py-2 border border-gray-300 text-gray-700 rounded-lg 
         hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 
         focus:ring-offset-2 transition-colors font-medium;
}
</style>
