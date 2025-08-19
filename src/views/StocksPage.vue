<script setup>
import { useStocksStore } from '@/stores/stocks'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

// 1. Получаем экземпляр хранилища
const stocksStore = useStocksStore()

// 2. Извлекаем реактивные переменные
const { stocks, loading, error, page, totalPages } = storeToRefs(stocksStore)

// 3. Загружаем данные при создании компонента
onMounted(() => {
  stocksStore.fetchStocks()
})
</script>

<template>
  <div class="orders-page">
    <h2>Акции</h2>
    
    <!-- Состояние загрузки -->
    <div v-if="loading" class="loading">Загрузка данных...</div>
    
    <!-- Ошибка -->
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <!-- Данные -->
    <div v-else>
      <!-- Пагинация -->
      <div class="pagination">
        <button @click="stocksStore.prevPage" :disabled="page === 1">← Назад</button>
        <span>Страница {{ page }} из {{ totalPages }}</span>
        <button @click="stocksStore.nextPage" :disabled="page === totalPages">Вперед →</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Название склада</th>
            <th>Цена</th>
            <th>Дата</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(stock, i) in stocks" :key="stock.id">
            <td>{{ i+1 }}</td>
            <td>{{ stock.warehouse_name }}</td>
            <td>{{ stock.price }} р.</td>
            <td>{{ stock.date }}</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Пагинация -->
      <div class="pagination">
        <button @click="stocksStore.prevPage" :disabled="page === 1">← Назад</button>
        <span>Страница {{ page }} из {{ totalPages }}</span>
        <button @click="stocksStore.nextPage" :disabled="page === totalPages">Вперед →</button>
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
</style>