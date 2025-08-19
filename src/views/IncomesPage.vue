<script setup>
import { useIncomesStore } from '@/stores/incomes'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

// 1. Получаем экземпляр хранилища
const incomesStore = useIncomesStore()

// 2. Извлекаем реактивные переменные
const { incomes, loading, error, page, totalPages,
  filters
 } = storeToRefs(incomesStore)

// Локальные фильтры для формы
const localFilters = ref({
  dateFrom: filters.value.dateFrom,
  dateTo: filters.value.dateTo,
  region: filters.value.region
})

// Применяем фильтры
const applyFilters = () => {
  incomesStore.applyFilters(localFilters.value)
  
}



// 3. Загружаем данные при создании компонента
onMounted(() => {
  incomesStore.fetchIncomes()
})
</script>

<template>
  <div>
    <h2>Доходы</h2>


            <!-- Фильтры -->
    <div class="filters">
      <div class="filter-group">
        <label>Дата от:</label>
        <input type="date" v-model="localFilters.dateFrom">
      </div>
      
      <div class="filter-group">
        <label>Дата до:</label>
        <input type="date" v-model="localFilters.dateTo">
      </div>
      
      <div class="filter-group">
        <label>Регион:</label>
        <input type="text" v-model="localFilters.region" placeholder="Введите область">
      </div>
       <button @click="applyFilters" class="apply-btn">Применить</button>
      <button @click="incomesStore.resetFilters" class="reset-btn">Сбросить</button>
    </div>

        <!-- Состояние загрузки -->
    <div v-if="loading" class="loading">Загрузка данных...</div>
    
    <!-- Ошибка -->
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <!-- Данные -->
    <div v-else>
        <div class="pagination">
          <button @click="incomesStore.prevPage" :disabled="page === 1">← Назад</button>
          <span>Страница {{ page }} из {{ totalPages }}</span>
          <button @click="incomesStore.nextPage" :disabled="page === totalPages">Вперед →</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>№</th>
                    <th>Колличество</th>
                    <th>Дата закрытия</th>
                    <th>Штрикод</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(income, i) in incomes" :key="income.id">
                    <td>{{ i+1 }}</td>
                    <td>{{ income.quantity }}</td>
                    <td>{{ income.date_close }}</td>
                    <td>{{ income.barcode }}</td>
                </tr>
            </tbody>
        </table>

              <!-- Пагинация -->
      <div class="pagination">
        <button @click="incomesStore.prevPage" :disabled="page === 1">← Назад</button>
        <span>Страница {{ page }} из {{ totalPages }}</span>
        <button @click="incomesStore.nextPage" :disabled="page === totalPages">Вперед →</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f2f2f2;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
}

button {
  padding: 8px 16px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading, .error {
  padding: 20px;
  text-align: center;
  font-size: 1.2em;
}
.error {
  color: #ff5252;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-size: 0.9em;
  color: #555;
}

.filter-group input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.reset-btn {
  background: #f44336;
  padding: 8px 16px;
  height: fit-content;
}

.apply-btn {
  background: #42b983;
  padding: 8px 16px;
  height: fit-content;
}
</style>

