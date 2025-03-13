<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Invoice Generator</h1>
        <p class="mt-1 text-sm text-gray-500">Create and manage GST-compliant invoices</p>
      </div>
      <button @click="showCreateInvoiceModal = true" class="btn-primary">
        <i class="fas fa-plus mr-2"></i>
        Create Invoice
      </button>
    </div>

    <!-- Invoice Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100">
            <i class="fas fa-file-invoice text-blue-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Total Invoices</h3>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.totalInvoices }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100">
            <i class="fas fa-check-circle text-green-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Paid</h3>
            <p class="text-2xl font-semibold text-gray-900">${{ stats.totalPaid }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100">
            <i class="fas fa-clock text-yellow-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Pending</h3>
            <p class="text-2xl font-semibold text-gray-900">${{ stats.totalPending }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-red-100">
            <i class="fas fa-exclamation-circle text-red-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Overdue</h3>
            <p class="text-2xl font-semibold text-gray-900">${{ stats.totalOverdue }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Invoice List -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="p-6 border-b border-gray-200">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-lg font-medium text-gray-900">Recent Invoices</h2>
          <div class="mt-3 sm:mt-0 flex items-center space-x-3">
            <div class="relative">
              <input 
                type="text" 
                placeholder="Search invoices..." 
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
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Invoice Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="invoice in filteredInvoices" :key="invoice.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">#{{ invoice.number }}</div>
                <div class="text-sm text-gray-500">{{ invoice.date }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full">
                    <img :src="invoice.customerAvatar" :alt="invoice.customerName" class="h-8 w-8 rounded-full">
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ invoice.customerName }}</div>
                    <div class="text-sm text-gray-500">{{ invoice.customerEmail }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${{ invoice.amount }}</div>
                <div class="text-sm text-gray-500">{{ invoice.currency }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-800': invoice.status === 'paid',
                    'bg-yellow-100 text-yellow-800': invoice.status === 'pending',
                    'bg-red-100 text-red-800': invoice.status === 'overdue'
                  }"
                >
                  {{ invoice.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ invoice.dueDate }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-3">
                  <button 
                    @click="viewInvoice(invoice)"
                    class="text-primary-600 hover:text-primary-900"
                    title="View Invoice"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    @click="downloadInvoice(invoice)"
                    class="text-gray-600 hover:text-gray-900"
                    title="Download PDF"
                  >
                    <i class="fas fa-download"></i>
                  </button>
                  <button 
                    v-if="invoice.status !== 'paid'"
                    @click="markAsPaid(invoice)"
                    class="text-green-600 hover:text-green-900"
                    title="Mark as Paid"
                  >
                    <i class="fas fa-check"></i>
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
                <span class="font-medium">{{ stats.totalInvoices }}</span>
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

    <!-- Create Invoice Modal -->
    <div v-if="showCreateInvoiceModal" class="modal-overlay" @click="showCreateInvoiceModal = false">
      <div class="modal-content max-w-4xl" @click.stop>
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Create New Invoice</h3>
            <button @click="showCreateInvoiceModal = false" class="text-gray-400 hover:text-gray-500">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form @submit.prevent="saveInvoice" class="space-y-6">
            <!-- Customer Details -->
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">Customer Information</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Customer</label>
                  <select 
                    v-model="invoiceForm.customerId"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                      {{ customer.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Due Date</label>
                  <input 
                    type="date" 
                    v-model="invoiceForm.dueDate"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                  >
                </div>
              </div>
            </div>

            <!-- Invoice Items -->
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">Invoice Items</h4>
              <div class="space-y-3">
                <div 
                  v-for="(item, index) in invoiceForm.items" 
                  :key="index"
                  class="grid grid-cols-12 gap-4"
                >
                  <div class="col-span-5">
                    <input 
                      type="text" 
                      v-model="item.description"
                      placeholder="Item description"
                      class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                    >
                  </div>
                  <div class="col-span-2">
                    <input 
                      type="number" 
                      v-model="item.quantity"
                      placeholder="Qty"
                      class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                    >
                  </div>
                  <div class="col-span-2">
                    <input 
                      type="number" 
                      v-model="item.rate"
                      placeholder="Rate"
                      class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                    >
                  </div>
                  <div class="col-span-2">
                    <div class="block w-full py-2 px-3 text-gray-700">
                      ${{ (item.quantity * item.rate).toFixed(2) }}
                    </div>
                  </div>
                  <div class="col-span-1">
                    <button 
                      type="button"
                      @click="removeItem(index)"
                      class="text-red-600 hover:text-red-700"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                <button 
                  type="button"
                  @click="addItem"
                  class="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  <i class="fas fa-plus mr-2"></i>
                  Add Item
                </button>
              </div>
            </div>

            <!-- Totals -->
            <div class="border-t border-gray-200 pt-4">
              <div class="flex justify-end">
                <div class="w-64 space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Subtotal:</span>
                    <span class="text-gray-900">${{ calculateSubtotal }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">GST (18%):</span>
                    <span class="text-gray-900">${{ calculateGST }}</span>
                  </div>
                  <div class="flex justify-between text-base font-medium">
                    <span class="text-gray-900">Total:</span>
                    <span class="text-gray-900">${{ calculateTotal }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button 
                type="button"
                @click="showCreateInvoiceModal = false"
                class="btn-outline"
              >
                Cancel
              </button>
              <button type="submit" class="btn-primary">
                Generate Invoice
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'InvoiceGenerator',
  setup() {
    const searchQuery = ref('')
    const filterStatus = ref('all')
    const showCreateInvoiceModal = ref(false)

    // Sample data - replace with API calls
    const stats = ref({
      totalInvoices: 156,
      totalPaid: '45,290',
      totalPending: '12,650',
      totalOverdue: '5,240'
    })

    const customers = ref([
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
    ])

    const invoices = ref([
      {
        id: 1,
        number: 'INV-2024-001',
        date: 'Jan 1, 2024',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerAvatar: 'https://ui-avatars.com/api/?name=John+Doe',
        amount: '299.00',
        currency: 'USD',
        status: 'paid',
        dueDate: 'Jan 15, 2024'
      },
      {
        id: 2,
        number: 'INV-2024-002',
        date: 'Jan 5, 2024',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerAvatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
        amount: '199.00',
        currency: 'USD',
        status: 'pending',
        dueDate: 'Jan 20, 2024'
      },
      {
        id: 3,
        number: 'INV-2024-003',
        date: 'Jan 10, 2024',
        customerName: 'Bob Johnson',
        customerEmail: 'bob@example.com',
        customerAvatar: 'https://ui-avatars.com/api/?name=Bob+Johnson',
        amount: '499.00',
        currency: 'USD',
        status: 'overdue',
        dueDate: 'Jan 25, 2024'
      }
    ])

    const invoiceForm = ref({
      customerId: '',
      dueDate: '',
      items: [
        { description: '', quantity: 1, rate: 0 }
      ]
    })

    const filteredInvoices = computed(() => {
      return invoices.value.filter(invoice => {
        const matchesSearch = 
          invoice.number.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          invoice.customerName.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesStatus = filterStatus.value === 'all' || invoice.status === filterStatus.value
        return matchesSearch && matchesStatus
      })
    })

    const calculateSubtotal = computed(() => {
      return invoiceForm.value.items.reduce((total, item) => {
        return total + (item.quantity * item.rate)
      }, 0).toFixed(2)
    })

    const calculateGST = computed(() => {
      return (parseFloat(calculateSubtotal.value) * 0.18).toFixed(2)
    })

    const calculateTotal = computed(() => {
      return (parseFloat(calculateSubtotal.value) + parseFloat(calculateGST.value)).toFixed(2)
    })

    function addItem() {
      invoiceForm.value.items.push({ description: '', quantity: 1, rate: 0 })
    }

    function removeItem(index) {
      invoiceForm.value.items.splice(index, 1)
    }

    function viewInvoice(invoice) {
      // Implement view invoice details
      console.log('View invoice:', invoice)
    }

    function downloadInvoice(invoice) {
      // Implement PDF download
      console.log('Download invoice:', invoice)
    }

    function markAsPaid(invoice) {
      invoice.status = 'paid'
    }

    function saveInvoice() {
      // Implement save invoice
      console.log('Save invoice:', invoiceForm.value)
      showCreateInvoiceModal.value = false
    }

    return {
      searchQuery,
      filterStatus,
      showCreateInvoiceModal,
      stats,
      customers,
      invoices,
      invoiceForm,
      filteredInvoices,
      calculateSubtotal,
      calculateGST,
      calculateTotal,
      addItem,
      removeItem,
      viewInvoice,
      downloadInvoice,
      markAsPaid,
      saveInvoice
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
