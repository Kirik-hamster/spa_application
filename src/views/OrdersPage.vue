<script setup>
import { useOrdersStore } from '@/stores/orders'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import OrdersChart from '@/components/OrdersChart.vue' // Добавляем импорт

// Получаем экземпляр хранилища
const ordersStore = useOrdersStore()

// Извлекаем реактивные переменные
const { orders, loading, error, page, totalPages, 
  filters, limitOptions, sortField, sortOrder, sortMenuOpen,
  totalFilteredOrders
} = storeToRefs(ordersStore)

// Локальные фильтры для формы
const localFilters = ref({
  dateFrom: filters.value.dateFrom,
  dateTo: filters.value.dateTo,
  region: filters.value.region,
  barcode: filters.value.barcode,
  limit: filters.value.limit
})

// Следим за изменениями filters из хранилища и обновляем localFilters
watch(filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })

// Применяем фильтры
const applyFilters = () => {
  ordersStore.applyFilters(localFilters.value)
}

// Сбрасываем фильтры
const resetFilters = () => {
  ordersStore.resetFilters()
}

// Загружаем данные при создании компонента
onMounted(() => {
  ordersStore.fetchOrders()
})
</script>

<template>
  <div class="orders-page">
    <h2>Заказы</h2>

    <!-- Фильтры в карточке -->
    <div class="card filters-card">
      <div class="card-header">
        <h2>Фильтры</h2>
      </div>
      <div class="card-body">
        <div class="filters-grid">
          <div class="filter-group">
            <label>Дата от</label>
            <input type="date" v-model="localFilters.dateFrom" class="filter-input">
          </div>
          
          <div class="filter-group">
            <label>Дата до</label>
            <input type="date" v-model="localFilters.dateTo" class="filter-input">
          </div>
          
          <div class="filter-group">
            <label>Регион</label>
            <input type="text" v-model="localFilters.region" placeholder="Введите регион" class="filter-input">
          </div>

          <div class="filter-group">
            <label>Штрихкод</label>
            <input type="text" v-model="localFilters.barcode" placeholder="Введите штрихкод" class="filter-input">
          </div>
                    
          <div class="filter-group">
            <label>Записей на одну страницу</label>
            <select v-model="localFilters.limit" class="filter-сount-per-page">
              <option v-for="option in limitOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
          
          <div class="filter-actions">
            <button @click="applyFilters" class="btn btn-primary apply-btn">
              <span class="btn-icon">✓</span>
              Применить
            </button>
            <button @click="resetFilters" class="btn btn-secondary reset-btn">
              <span class="btn-icon">↺</span>
              Сбросить
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Информация о фильтрации -->
    <div v-if="!loading && !error" class="filter-info card">
      <span>Найдено записей: {{ totalFilteredOrders }}</span>
    </div>
    
    <!-- Состояние загрузки -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Загрузка данных...</p>
    </div>
    
    <!-- Ошибка -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Произошла ошибка</h3>
      <p>{{ error }}</p>
    </div>
    
    <!-- Данные -->
    <div v-else>

      <!-- График -->
      <div class="card chart-card" v-if="!loading && !error">
        <div class="card-header">
          <h2>Визуализация заказов</h2>
        </div>
        <div class="card-body">
          <OrdersChart :orders="orders" />
        </div>
      </div>

      <!-- Сообщение если нет данных -->
      <div v-if="orders.length === 0" class="no-data">
        <p>Нет данных, соответствующих фильтрам</p>
      </div>

      <!-- Пагинация сверху -->
      <div class="pagination-top">
        <div class="pagination-info">
          <span>Страница {{ page }} из {{ totalPages }}</span>
          <span class="orders-count">Всего записей: {{ totalFilteredOrders }}</span>
        </div>
        <div class="pagination-controls">
          <button @click="ordersStore.prevPage" :disabled="page === 1" class="btn-pagination">
            <span class="pagination-icon">←</span> Назад
          </button>
          <button @click="ordersStore.nextPage" :disabled="page === totalPages" class="btn-pagination">
            Вперед <span class="pagination-icon">→</span>
          </button>
        </div>
      </div>

      <!-- Таблица -->
      <div class="table-card card">
        <div class="table-responsive">
          <table class="spa-table">
            <thead>
              <tr>
                <th>№</th>
                <th class="sortable-header" @click.stop="ordersStore.toggleSortMenu('discount_percent')">
                  <div class="header-content">
                    <span>Скидка</span>
                    <span class="sort-indicator">
                      <span v-if="sortField === 'discount_percent'">
                        {{ sortOrder === 'asc' ? '↑' : '↓' }}
                      </span>
                      <span v-else>↕</span>
                    </span>
                  </div>
                  <div v-if="sortMenuOpen === 'discount_percent'" class="sort-menu">
                    <div class="sort-option" @click="ordersStore.applySort('discount_percent', 'asc')">
                      возр. ↑
                    </div>
                    <div class="sort-option" @click="ordersStore.applySort('discount_percent', 'desc')">
                      убыв. ↓
                    </div>
                    <div v-if="sortField === 'discount_percent'" class="sort-option" @click="ordersStore.clearSort()">
                      Сброс
                    </div>
                  </div>
                </th>
                <th>Дата</th>
                <th>Регион</th>
                <th>Штрихкод товара</th>
                 <th class="sortable-header text-right" @click.stop="ordersStore.toggleSortMenu('total_price')">
                  <div class="header-content">
                    <span>Сумма</span>
                    <span class="sort-indicator">
                      <span v-if="sortField === 'total_price'">
                        {{ sortOrder === 'asc' ? '↑' : '↓' }}
                      </span>
                      <span v-else>↕</span>
                    </span>
                  </div>
                  <div v-if="sortMenuOpen === 'total_price'" class="sort-menu">
                    <div class="sort-option" @click="ordersStore.applySort('total_price', 'asc')">
                      возр. ↑
                    </div>
                    <div class="sort-option" @click="ordersStore.applySort('total_price', 'desc')">
                      убыв. ↓
                    </div>
                    <div v-if="sortField === 'total_price'" class="sort-option" @click="ordersStore.clearSort()">
                      сброс
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(order, i) in orders" :key="order.id">
                <td class="order-number">{{ (page - 1) * filters.limit + i + 1 }}</td>
                <td>
                  <span class="discount-badge" :class="{'high-discount': order.discount_percent > 15}">
                    {{ order.discount_percent }} %
                  </span>
                </td>
                <td>{{ order.date }}</td>
                <td>
                  <span class="region-tag">{{ order.oblast }}</span>
                </td>
                <td>{{ order.barcode }}</td>
                <td class="text-right">
                  <span class="price">{{ parseFloat(order.total_price).toFixed(2) }} руб.</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Пагинация снизу -->
      <div class="pagination-bottom">
        <div class="pagination-info">
          <span>Страница {{ page }} из {{ totalPages }}</span>
        </div>
        <div class="pagination-controls">
          <button @click="ordersStore.prevPage" :disabled="page === 1" class="btn-pagination">
            <span class="pagination-icon">←</span> Назад
          </button>
          <button @click="ordersStore.nextPage" :disabled="page === totalPages" class="btn-pagination">
            Вперед <span class="pagination-icon">→</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/styles/pages_spa.css';
@import '@/styles/sort_filter_table.css';


.filter-info {
  margin: 1rem 0;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

</style>