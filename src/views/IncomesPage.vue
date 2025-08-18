<script setup>
import { useIncomesStore } from '@/stores/incomes'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

// 1. Получаем экземпляр хранилища
const incomesStore = useIncomesStore()

// 2. Извлекаем реактивные переменные
const { incomes, loading, error, page, totalPages } = storeToRefs(incomesStore)

// 3. Загружаем данные при создании компонента
onMounted(() => {
  incomesStore.fetchIncomes()
})
</script>

<template>
  <div>
    <h2>Доходы</h2>
        <!-- Состояние загрузки -->
    <div v-if="loading" class="loading">Загрузка данных...</div>
    
    <!-- Ошибка -->
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <!-- Данные -->
    <div v-else>
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

