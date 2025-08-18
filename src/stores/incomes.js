import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useIncomesStore = defineStore('incomes', () => {
  const incomes = ref([])
  const loading = ref(false)
  const error = ref(null)
  const page = ref(1)
  const limit = ref(25)
  const totalPages = ref(1)
  
  // Функция для форматирования даты в YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0]
  }

  async function fetchIncomes() {
    try {
      loading.value = true
      error.value = null
      
      // Рассчитываем даты (последние 7 дней)
      const today = new Date()
      const dateTo = formatDate(today)
      const dateFrom = formatDate(new Date(today.setDate(today.getDate() - 7)))
      
      const response = await axios.get('http://109.73.206.144:6969/api/incomes', {
        params: {
          key: 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie',
          page: page.value,
          limit: limit.value,
          dateFrom, // Обязательный параметр
          dateTo    // Обязательный параметр
        }
      })
      console.log("incomes: ", response.data.data)
      
      incomes.value = response.data.data
      totalPages.value = 500 / limit.value
      
    } catch (err) {
      error.value = `Ошибка ${err.response?.status || 400}: ${err.response?.data?.message || 'Неверный запрос'}`
      console.error('Детали ошибки:', err.config)
    } finally {
      loading.value = false
    }
  }
    // ДОБАВЛЕННЫЕ ФУНКЦИИ ДЛЯ ПАГИНАЦИИ
  function nextPage() {
    if (page.value < totalPages.value) {
      page.value++
      fetchIncomes()
    }
  }

  function prevPage() {
    if (page.value > 1) {
      page.value--
      fetchIncomes()
    }
  }

    return {
    incomes,
    loading,
    error,
    page,
    totalPages,
    fetchIncomes, // <- не забудьте добавить эту строку!
    nextPage,
    prevPage
  }
})