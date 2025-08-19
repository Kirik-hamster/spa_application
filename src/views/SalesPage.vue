<script setup>
import { useSalesStore } from '@/stores/sales'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

// 1. Получаем экземпляр хранилища
const salesStore = useSalesStore()

// 2. Извлекаем реактивные переменные
const { sales, loading, error, page, totalPages } = storeToRefs(salesStore)

// 3. Загружаем данные при создании компонента
onMounted(() => {
  salesStore.fetchSales()
})
</script>

<template>
  <div class="orders-page">
    <h2>Продажи</h2>
    
    <!-- Состояние загрузки -->
    <div v-if="loading" class="loading">Загрузка данных...</div>
    
    <!-- Ошибка -->
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <!-- Данные -->
    <div v-else>
      <!-- Пагинация -->
      <div class="pagination">
        <button @click="salesStore.prevPage" :disabled="page === 1">← Назад</button>
        <span>Страница {{ page }} из {{ totalPages }}</span>
        <button @click="salesStore.nextPage" :disabled="page === totalPages">Вперед →</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Регион</th>
            <th>Дата</th>
            <th>Полная Стоимость</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(sale, i) in sales" :key="sale.id">
            <td>{{ i+1 }}</td>
            <td>{{ sale.region_name }}</td>
            <td>{{ sale.date }}</td>
            <td>{{ sale.total_price }} р</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Пагинация -->
      <div class="pagination">
        <button @click="salesStore.prevPage" :disabled="page === 1">← Назад</button>
        <span>Страница {{ page }} из {{ totalPages }}</span>
        <button @click="salesStore.nextPage" :disabled="page === totalPages">Вперед →</button>
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