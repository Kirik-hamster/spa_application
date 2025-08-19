<script setup>
import { useSalesStore } from '@/stores/sales'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import SalesChart from '@/components/SalesChart.vue' // Добавляем импорт

// 1. Получаем экземпляр хранилища
const salesStore = useSalesStore()

// 2. Извлекаем реактивные переменные
const { sales, loading, error, page, totalPages, 
  filters } = storeToRefs(salesStore)

// Локальные фильтры для формы
const localFilters = ref({
  dateFrom: filters.value.dateFrom,
  dateTo: filters.value.dateTo,
  region: filters.value.region
})  

// Применяем фильтры
const applyFilters = () => {
  salesStore.applyFilters(localFilters.value)
}

// 3. Загружаем данные при создании компонента
onMounted(() => {
  salesStore.fetchSales()
})
</script>

<template>
  <div class="orders-page">
    <h2>Продажи</h2>

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
            <button @click="salesStore.resetFilters" class="btn btn-secondary reset-btn">
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
          <h2>Визуализация продаж заказов</h2>
        </div>
        <div class="card-body">
          <SalesChart :sales="sales" />
        </div>
      </div>

      <!-- Пагинация сверху -->
      <div class="pagination-top">
        <div class="pagination-info">
          <span>Страница {{ page }} из {{ totalPages }}</span>
          <span class="orders-count">Всего записей: {{ salesStore.totalOrders }}</span>
        </div>
        <div class="pagination-controls">
          <button @click="salesStore.prevPage" :disabled="page === 1" class="btn-pagination">
            <span class="pagination-icon">←</span> Назад
          </button>
          <button @click="salesStore.nextPage" :disabled="page === totalPages" class="btn-pagination">
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
                <th>Регион</th>
                <th>Дата</th>
                <th>Штрикод товара</th>
                <th class="text-right">Полная Стоимость</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(sale, i) in sales" :key="sale.id">
                <td class="order-number">{{ i+1 }}</td>
                <td>
                  <span class="discount-badge" :class="{'high-discount': sale.discount_percent > 15}">
                    {{ sale.discount_percent }} %
                  </span>
                </td>
                <td>
                  <span class="region-tag">{{ sale.region_name }}</span>
                </td>
                <td>{{ sale.date }}</td>
                <td>{{ sale.barcode }}</td>
                <td class="text-right">
                  <span class="price">{{ parseFloat(sale.total_price).toFixed(2) }} руб.</span>
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
          <button @click="salesStore.prevPage" :disabled="page === 1" class="btn-pagination">
            <span class="pagination-icon">←</span> Назад
          </button>
          <button @click="salesStore.nextPage" :disabled="page === totalPages" class="btn-pagination">
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