import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useSalesStore = defineStore('sales', () => {
  const sales = ref([])
  const loading = ref(false)
  const error = ref(null)
  const page = ref(1)
  const limit = ref(500)
  const totalPages = ref(1)
  
  // Функция для форматирования даты в YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0]
  }

  // Изначальные фильтры (последние 7 дней)
  const filters = ref({
    dateFrom: formatDate(new Date(new Date().setDate(new Date().getDate() - 7))),
    dateTo: formatDate(new Date()),
    limit: limit.value,
    region: ''
  })

  // Опции для лимита
  const limitOptions = ref([25, 50, 100, 250, 500])

  async function fetchSales() {
    try {
      loading.value = true
      error.value = null

      const sicretKey = 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie'
      
      const response = await axios.get('https://thingproxy.freeboard.io/fetch/http://109.73.206.144:6969/api/sales', {
        params: {
          key: sicretKey,
          page: page.value,
          limit: filters.value.limit,
          dateFrom: filters.value.dateFrom, 
          dateTo: filters.value.dateTo   
        }
      })
      console.log("sales: ", response.data.data)
      sales.value = response.data.data
      totalPages.value = Math.ceil(response.data.meta.total / limit.value)
      
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
      fetchSales()
    }
  }

  function prevPage() {
    if (page.value > 1) {
      page.value--
      fetchSales()
    }
  }

  // Функция применения фильтров
  function applyFilters(newFilters = {}) {
    page.value = 1 // Сбрасываем на первую страницу при изменении фильтров
    filters.value = {
      ...filters.value,
      ...newFilters
    }
    limit.value = filters.value.limit
    fetchSales()
  }

  // Функция сброса фильтров
  function resetFilters() {
    const today = new Date()
    applyFilters({
      dateFrom: formatDate(new Date(today.setDate(today.getDate() - 7))),
      dateTo: formatDate(new Date()),
      lmit: 500,
      region: ''
    })
  }

  return {
    sales,
    loading,
    error,
    page,
    totalPages,
    filters,
    limitOptions,
    fetchSales,
    nextPage,
    prevPage,
    applyFilters,
    resetFilters
  }
})