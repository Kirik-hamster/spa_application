import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useStocksStore = defineStore('stocks', () => {
  const allStocks = ref([])
  const filteredStocks = ref([])
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
    warehouse_name: '',
    barcode: ''
  })

  // Опции для лимита
  const limitOptions = ref([10, 25, 50, 100, 250, 500])

  // Computed свойство для отображаемых заказов с пагинацией
  const stocks = computed(() => {
    // Создаем копию отфильтрованных данных для сортировки
    let sortedData = [...filteredStocks.value]
  
    // Применяем сортировку если она активна
    if (sortField.value) {
      sortedData.sort((a, b) => {
        // Приводим значения к числам, если это числовые поля
        let valueA = a[sortField.value]
        let valueB = b[sortField.value]
        
        if (sortField.value === 'in_way_from_client' || sortField.value === 'price') {
          valueA = parseFloat(valueA) || 0
          valueB = parseFloat(valueB) || 0
        }
        
        if (sortStocks.value === 'asc') {
          return valueA > valueB ? 1 : -1
        } else {
          return valueA < valueB ? 1 : -1
        }
      })
    }
    const start = (page.value - 1) * filters.value.limit
    const end = start + filters.value.limit
    return sortedData.slice(start, end)
  })

  // Computed свойство для общего количества отфильтрованных заказов
  const totalFilteredStocks = computed(() => {
    return filteredStocks.value.length
  })

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
      allStocks.value = response.data.data
      totalPages.value = Math.ceil(response.data.meta.total / limit.value)
      applyFilters()
    } catch (err) {
      error.value = `Ошибка ${err.response?.status || 400}: ${err.response?.data?.message || 'Неверный запрос'}`
      console.error('Детали ошибки:', err.config)
    } finally {
      loading.value = false
    }
  }

  // Функция для сортировки текущей страницы
  function applySort(field, stock) {
    sortField.value = field
    sortStocks.value = stock
    sortMenuOpen.value = null // Закрываем меню после выбора
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
    // Переприменяем фильтры чтобы обновить отображение (без перезагрузки)
    applyFilters()
  }

  // ДОБАВЛЕННЫЕ ФУНКЦИИ ДЛЯ ПАГИНАЦИИ
  function nextPage() {
    if (page.value < totalPages.value) {
      page.value++
    }
  }

  function prevPage() {
    if (page.value > 1) {
      page.value--
    }
  }

  // Функция применения фильтров
  function applyFilters(newFilters = {}) {
    if (newFilters) {
      filters.value = {
        ...filters.value,
        ...newFilters
      }
    }

    // Фильтрация данных
    filteredStocks.value = allStocks.value.filter(stock => {
      // Фильтр по warehouse_name 
      if (filters.value.warehouse_name && 
          !stock.warehouse_name?.toLowerCase().includes(filters.value.warehouse_name.toLowerCase())) {
        return false
      }

      // Фильтр по штрихкоду (точное совпадение)
      if (filters.value.barcode && stock.barcode != filters.value.barcode) {
        return false
      }

      // Фильтр по дате 
      const orderDate = new Date(stock.date)
      const fromDate = new Date(filters.value.dateFrom)
      const toDate = new Date(filters.value.dateTo)
      
      if (orderDate < fromDate || orderDate > toDate) {
        return false
      }

      return true
    })

    // Пересчет пагинации
    page.value = 1
    totalPages.value = Math.ceil(filteredStocks.value.length / filters.value.limit)
  }

  // Функция для получения сброшенных фильтров (добавьте эту функцию)
  function getResetFilters() {
    const today = new Date()
    return {
      dateFrom: formatDate(new Date()),
      dateTo: formatDate(new Date()),
      limit: 500,
      warehouse_name: '',
      barcode: ''
    }
  }

  // Функция сброса фильтров
  function resetFilters() {
    const resetFilters = getResetFilters()
    applyFilters(resetFilters)
    // Также сбрасываем сортировку при полном сбросе
    clearSort()
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
    totalFilteredStocks,
    fetchStocks,
    nextPage,
    prevPage,
    applyFilters,
    resetFilters,
    applySort,
    toggleSortMenu,
    clearSort,
    getResetFilters
  }
})