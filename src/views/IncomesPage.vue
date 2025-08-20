<script setup>
import { useIncomesStore } from '@/stores/incomes'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import IncomesChart from '@/components/IncomesChart.vue' // Добавляем импорт

// Получаем экземпляр хранилища
const incomesStore = useIncomesStore()

// Извлекаем реактивные переменные
const { incomes, loading, error, page, totalPages,
  filters, limitOptions, sortField, sortIncomes, sortMenuOpen,
  totalFilteredIncomes
 } = storeToRefs(incomesStore)

// Локальные фильтры для формы
const localFilters = ref({
  dateFrom: filters.value.dateFrom,
  dateTo: filters.value.dateTo,
  warehouse_name: filters.value.warehouse_name,
  barcode: filters.value.barcode,
  limit: filters.value.limit
})

// Следим за изменениями filters из хранилища и обновляем localFilters
watch(filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })

// Применяем фильтры
const applyFilters = () => {
  incomesStore.applyFilters(localFilters.value)
}

// Сбрасываем фильтры
const resetFilters = () => {
  incomesStore.resetFilters()
}

// Загружаем данные при создании компонента
onMounted(() => {
  incomesStore.fetchIncomes()
})
</script>

<template>
  <div>
    <h2>Доходы</h2>

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
            <label>Название склада</label>
            <input type="text" v-model="localFilters.warehouse_name" placeholder="Введите название склада" class="filter-input">
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
      <span>Найдено записей: {{ totalFilteredIncomes }}</span>
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
          <h2>Визуализация доходов</h2>
        </div>
        <div class="card-body">
          <IncomesChart :incomes="incomes" />
        </div>
      </div>

      <!-- Пагинация сверху -->
      <div class="pagination-top">
        <div class="pagination-info">
          <span>Страница {{ page }} из {{ totalPages }}</span>
          <span class="orders-count">Всего записей: {{ totalFilteredIncomes }}</span>
        </div>
        <div class="pagination-controls">
          <button @click="incomesStore.prevPage" :disabled="page === 1" class="btn-pagination">
            <span class="pagination-icon">←</span> Назад
          </button>
          <button @click="incomesStore.nextPage" :disabled="page === totalPages" class="btn-pagination">
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
                      <th>Название склада</th>
                      <th>Дата</th>
                      <th class="sortable-header" @click.stop="incomesStore.toggleSortMenu('quantity')">
                        <div class="header-content">
                          <span>Колличество продано</span>
                          <span class="sort-indicator">
                            <span v-if="sortField === 'quantity'">
                              {{ sortIncomes === 'asc' ? '↑' : '↓' }}
                            </span>
                            <span v-else>↕</span>
                          </span>
                        </div>
                        <div v-if="sortMenuOpen === 'quantity'" class="sort-menu">
                          <div class="sort-option" @click="incomesStore.applySort('quantity', 'asc')">
                            возр. ↑
                          </div>
                          <div class="sort-option" @click="incomesStore.applySort('quantity', 'desc')">
                            убыв. ↓
                          </div>
                          <div v-if="sortField === 'quantity'" class="sort-option" @click="incomesStore.clearSort()">
                            Сброс
                          </div>
                        </div>                        
                      </th>
                      <th>Штрикод товара</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(income, i) in incomes" :key="income.id">
                      <td class="order-number">{{ (page - 1) * filters.limit + i + 1 }}</td>
                      <td>
                        <span class="region-tag">{{ income.warehouse_name }}</span>
                      </td>
                      <td>{{ income.date }}</td>
                      <td>{{ income.quantity }}</td>
                      <td>{{ income.barcode }}</td>
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
          <button @click="incomesStore.prevPage" :disabled="page === 1" class="btn-pagination">
            <span class="pagination-icon">←</span> Назад
          </button>
          <button @click="incomesStore.nextPage" :disabled="page === totalPages" class="btn-pagination">
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
</style>

