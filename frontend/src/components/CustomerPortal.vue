<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Customer Portal</h1>
        <p class="mt-1 text-sm text-gray-500">Manage your customers and their subscriptions</p>
      </div>
      <button @click="showAddCustomerModal = true" class="btn-primary">
        <i class="fas fa-user-plus mr-2"></i>
        Add Customer
      </button>
    </div>

    <!-- Customer Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-primary-100">
            <i class="fas fa-users text-primary-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Total Customers</h3>
            <p class="text-2xl font-semibold text-gray-900">{{ totalCustomers }}</p>
            <p class="text-sm text-green-600">
              <i class="fas fa-arrow-up mr-1"></i>
              12% increase
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100">
            <i class="fas fa-user-check text-green-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Active Subscriptions</h3>
            <p class="text-2xl font-semibold text-gray-900">{{ activeSubscriptions }}</p>
            <p class="text-sm text-green-600">
              <i class="fas fa-arrow-up mr-1"></i>
              8% increase
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100">
            <i class="fas fa-clock text-yellow-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Trial Customers</h3>
            <p class="text-2xl font-semibold text-gray-900">{{ trialCustomers }}</p>
            <p class="text-sm text-yellow-600">
              <i class="fas fa-arrow-right mr-1"></i>
              Stable
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer List -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="p-6 border-b border-gray-200">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-lg font-medium text-gray-900">Customer List</h2>
          <div class="mt-3 sm:mt-0 flex items-center space-x-3">
            <div class="relative">
              <input 
                type="text" 
                placeholder="Search customers..." 
                v-model="searchQuery"
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
              <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <select 
              v-model="filterStatus"
              class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Customer Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscription
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Billing
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Payment
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="customer in filteredCustomers" :key="customer.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full overflow-hidden">
                    <img :src="customer.avatar" :alt="customer.name" class="h-full w-full object-cover">
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ customer.name }}</div>
                    <div class="text-sm text-gray-500">{{ customer.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ customer.plan }}</div>
                <div class="text-sm text-gray-500">{{ customer.subscriptionDate }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-800': customer.status === 'active',
                    'bg-yellow-100 text-yellow-800': customer.status === 'trial',
                    'bg-red-100 text-red-800': customer.status === 'expired'
                  }"
                >
                  {{ customer.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${{ customer.billing }}/month</div>
                <div class="text-sm text-gray-500">{{ customer.nextBilling }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${{ customer.lastPayment }}</div>
                <div class="text-sm text-gray-500">{{ customer.lastPaymentDate }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-3">
                  <button 
                    @click="viewCustomer(customer)"
                    class="text-primary-600 hover:text-primary-900"
                    title="View Details"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    @click="editCustomer(customer)"
                    class="text-gray-600 hover:text-gray-900"
                    title="Edit Customer"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="showDeleteConfirm(customer)"
                    class="text-red-600 hover:text-red-900"
                    title="Delete Customer"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button class="btn-outline">Previous</button>
            <button class="btn-outline">Next</button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">1</span>
                to
                <span class="font-medium">10</span>
                of
                <span class="font-medium">{{ totalCustomers }}</span>
                results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button class="btn-pagination rounded-l-md">
                  <i class="fas fa-chevron-left"></i>
                </button>
                <button 
                  v-for="page in 3" 
                  :key="page"
                  class="btn-pagination"
                  :class="{ 'bg-primary-50 text-primary-600': page === 1 }"
                >
                  {{ page }}
                </button>
                <button class="btn-pagination rounded-r-md">
                  <i class="fas fa-chevron-right"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Customer Modal -->
    <div v-if="showAddCustomerModal" class="modal-overlay" @click="showAddCustomerModal = false">
      <div class="modal-content max-w-2xl" @click.stop>
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ editingCustomer ? 'Edit Customer' : 'Add New Customer' }}
            </h3>
            <button @click="showAddCustomerModal = false" class="text-gray-400 hover:text-gray-500">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form @submit.prevent="saveCustomer" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  v-model="customerForm.name"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter full name"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  v-model="customerForm.email"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter email address"
                >
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Subscription Plan</label>
                <select 
                  v-model="customerForm.plan"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Basic">Basic Plan</option>
                  <option value="Pro">Pro Plan</option>
                  <option value="Enterprise">Enterprise Plan</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <select 
                  v-model="customerForm.status"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="trial">Trial</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Billing Amount</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input 
                    type="number" 
                    v-model="customerForm.billing"
                    class="block w-full pl-7 pr-12 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0.00"
                  >
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Next Billing Date</label>
                <input 
                  type="date" 
                  v-model="customerForm.nextBilling"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                >
              </div>
            </div>

            <div class="flex items-center justify-end space-x-3 mt-6">
              <button 
                type="button"
                @click="showAddCustomerModal = false"
                class="btn-outline"
              >
                Cancel
              </button>
              <button type="submit" class="btn-primary">
                {{ editingCustomer ? 'Save Changes' : 'Add Customer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content max-w-md" @click.stop>
        <div class="p-6">
          <div class="flex items-center justify-center mb-4">
            <div class="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
            </div>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mb-2">
            Delete Customer
          </h3>
          <p class="text-sm text-gray-500 text-center mb-6">
            Are you sure you want to delete this customer? This action cannot be undone.
          </p>
          <div class="flex items-center justify-center space-x-3">
            <button 
              @click="showDeleteModal = false"
              class="btn-outline"
            >
              Cancel
            </button>
            <button 
              @click="deleteCustomer"
              class="btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'CustomerPortal',
  setup() {
    const searchQuery = ref('')
    const filterStatus = ref('all')
    const showAddCustomerModal = ref(false)
    const showDeleteModal = ref(false)
    const editingCustomer = ref(null)
    const customerToDelete = ref(null)

    const customerForm = ref({
      name: '',
      email: '',
      plan: 'Basic',
      status: 'active',
      billing: '',
      nextBilling: ''
    })

    // Sample data - replace with API calls
    const customers = ref([
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe',
        plan: 'Pro Plan',
        status: 'active',
        subscriptionDate: 'Jan 1, 2024',
        billing: 99,
        nextBilling: 'Feb 1, 2024',
        lastPayment: 99,
        lastPaymentDate: 'Jan 1, 2024'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
        plan: 'Basic Plan',
        status: 'trial',
        subscriptionDate: 'Jan 15, 2024',
        billing: 29,
        nextBilling: 'Feb 15, 2024',
        lastPayment: 0,
        lastPaymentDate: 'N/A'
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson',
        plan: 'Enterprise Plan',
        status: 'active',
        subscriptionDate: 'Dec 1, 2023',
        billing: 299,
        nextBilling: 'Feb 1, 2024',
        lastPayment: 299,
        lastPaymentDate: 'Jan 1, 2024'
      }
    ])

    const filteredCustomers = computed(() => {
      return customers.value.filter(customer => {
        const matchesSearch = 
          customer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesStatus = filterStatus.value === 'all' || customer.status === filterStatus.value
        return matchesSearch && matchesStatus
      })
    })

    const totalCustomers = computed(() => customers.value.length)
    const activeSubscriptions = computed(() => 
      customers.value.filter(c => c.status === 'active').length
    )
    const trialCustomers = computed(() => 
      customers.value.filter(c => c.status === 'trial').length
    )

    function viewCustomer(customer) {
      // Implement view customer details
      console.log('View customer:', customer)
    }

    function editCustomer(customer) {
      editingCustomer.value = customer
      customerForm.value = { ...customer }
      showAddCustomerModal.value = true
    }

    function showDeleteConfirm(customer) {
      customerToDelete.value = customer
      showDeleteModal.value = true
    }

    function deleteCustomer() {
      if (customerToDelete.value) {
        customers.value = customers.value.filter(c => c.id !== customerToDelete.value.id)
        showDeleteModal.value = false
        customerToDelete.value = null
      }
    }

    function saveCustomer() {
      if (editingCustomer.value) {
        // Update existing customer
        const index = customers.value.findIndex(c => c.id === editingCustomer.value.id)
        customers.value[index] = { 
          ...customers.value[index], 
          ...customerForm.value,
          avatar: `https://ui-avatars.com/api/?name=${customerForm.value.name.replace(' ', '+')}`
        }
      } else {
        // Create new customer
        const newCustomer = {
          id: customers.value.length + 1,
          ...customerForm.value,
          avatar: `https://ui-avatars.com/api/?name=${customerForm.value.name.replace(' ', '+')}`,
          subscriptionDate: new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          lastPayment: 0,
          lastPaymentDate: 'N/A'
        }
        customers.value.push(newCustomer)
      }
      
      showAddCustomerModal.value = false
      editingCustomer.value = null
      customerForm.value = {
        name: '',
        email: '',
        plan: 'Basic',
        status: 'active',
        billing: '',
        nextBilling: ''
      }
    }

    return {
      searchQuery,
      filterStatus,
      showAddCustomerModal,
      showDeleteModal,
      editingCustomer,
      customerForm,
      customers,
      filteredCustomers,
      totalCustomers,
      activeSubscriptions,
      trialCustomers,
      viewCustomer,
      editCustomer,
      showDeleteConfirm,
      deleteCustomer,
      saveCustomer
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

.btn-danger {
  @apply px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
         focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
         transition-colors font-medium;
}

.btn-pagination {
  @apply relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium 
         text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 
         focus:border-primary-500;
}

.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 z-40;
}

.modal-content {
  @apply fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50;
}
</style>
