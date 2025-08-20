import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useStocksStore = defineStore('stocks', () => {
  const stocks = ref([])
  const loading = ref(false)
  const error = ref(null)
  const page = ref(1)
  const limit = ref(500)
  const totalPages = ref(1)

  // Добавляем состояние для сортировки
  const sortField = ref(null)
  const sortStocks = ref('asc') // 'asc' или 'desc'
  const sortMenuOpen = ref(null) // Для отслеживания открытого меню
  
  // Функция для форматирования даты в YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0]
  }

  // Изначальные фильтры (последние 7 дней)
  const filters = ref({
    dateFrom: formatDate(new Date()),
    dateTo: formatDate(new Date()),
    limit: limit.value,
    region: ''
  })

  // Опции для лимита
  const limitOptions = ref([25, 50, 100, 250, 500])

  async function fetchStocks() {
    try {
      loading.value = true
      error.value = null

      const sicretKey = 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie'
      
      const response = await axios.get('api/api', {
        params: {
          path: 'stocks',
          key: sicretKey,
          page: page.value,
          limit: filters.value.limit,
          dateFrom: filters.value.dateFrom, 
          dateTo: filters.value.dateTo   
        }
      })
      console.log("stocks: ", response.data.data)
      stocks.value = response.data.data
      totalPages.value = Math.ceil(response.data.meta.total / limit.value)
      
    } catch (err) {
      error.value = `Ошибка ${err.response?.status || 400}: ${err.response?.data?.message || 'Неверный запрос'}`
      console.error('Детали ошибки:', err.config)
    } finally {
      loading.value = false
    }
  }

  // Функция для сортировки текущей страницы
  function applySort(field, order) {
    sortField.value = field
    sortStocks.value = order
    sortMenuOpen.value = null // Закрываем меню после выбора
    
    // Сортируем данные текущей страницы
    stocks.value.sort((a, b) => {
      // Приводим значения к числам, если это числовые поля
      let valueA = a[field]
      let valueB = b[field]
      
      if (field === 'in_way_from_client' || field === 'price') {
        valueA = parseFloat(valueA) || 0
        valueB = parseFloat(valueB) || 0
      }
      
      if (order === 'asc') {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })
  }

  // Функция для открытия/закрытия меню сортировки
  function toggleSortMenu(field) {
    if (sortMenuOpen.value === field) {
      sortMenuOpen.value = null
    } else {
      sortMenuOpen.value = field
    }
  }

  // Функция для сброса сортировки
  function clearSort() {
    sortField.value = null
    sortStocks.value = null
    sortMenuOpen.value = null
    // Здесь нужно перезагрузить данные в исходном порядке
    fetchStocks()
  }

  // ДОБАВЛЕННЫЕ ФУНКЦИИ ДЛЯ ПАГИНАЦИИ
  function nextPage() {
    if (page.value < totalPages.value) {
      page.value++
      fetchStocks()
    }
  }

  function prevPage() {
    if (page.value > 1) {
      page.value--
      fetchStocks()
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
    fetchStocks()
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
    stocks,
    loading,
    error,
    page,
    totalPages,
    filters,
    limitOptions,
    sortField,
    sortStocks,
    sortMenuOpen,
    fetchStocks,
    nextPage,
    prevPage,
    applyFilters,
    resetFilters,
    applySort,
    toggleSortMenu,
    clearSort
  }
})