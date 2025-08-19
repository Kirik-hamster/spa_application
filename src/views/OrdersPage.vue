<script setup>
import { useOrdersStore } from '@/stores/orders'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import OrdersChart from '@/components/OrdersChart.vue' // Добавляем импорт

// 1. Получаем экземпляр хранилища
const ordersStore = useOrdersStore()

// 2. Извлекаем реактивные переменные
const { orders, loading, error, page, totalPages, 
  filters } = storeToRefs(ordersStore)

// Локальные фильтры для формы
const localFilters = ref({
  dateFrom: filters.value.dateFrom,
  dateTo: filters.value.dateTo,
  region: filters.value.region
})


// Применяем фильтры
const applyFilters = () => {
  ordersStore.applyFilters(localFilters.value)
}

// 3. Загружаем данные при создании компонента
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
            <input type="text" v-model="localFilters.region" placeholder="Введите область" class="filter-input">
          </div>
          
          <div class="filter-actions">
            <button @click="applyFilters" class="btn btn-primary apply-btn">
              <span class="btn-icon">✓</span>
              Применить
            </button>
            <button @click="ordersStore.resetFilters" class="btn btn-secondary reset-btn">
              <span class="btn-icon">↺</span>
              Сбросить
            </button>
          </div>
        </div>
      </div>
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

      <!-- Пагинация сверху -->
      <div class="pagination-top">
        <div class="pagination-info">
          <span>Страница {{ page }} из {{ totalPages }}</span>
          <span class="orders-count">Всего записей: {{ ordersStore.totalOrders }}</span>
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
                <th>Скидка</th>
                <th>Дата</th>
                <th>Регион</th>
                <th>Штрихкод товара</th>
                <th class="text-right">Сумма</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(order, i) in orders" :key="order.id">
                <td class="order-number">{{ i+1 }}</td>
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
</style>