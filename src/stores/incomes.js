import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useIncomesStore = defineStore('incomes', () => {
  const incomes = ref([])
  const loading = ref(false)
  const error = ref(null)
  const page = ref(1)
  const limit = ref(500)
  const totalPages = ref(1)

  // состояние для сортировки
  const sortField = ref(null)
  const sortIncomes = ref('asc') // 'asc' или 'desc'
  const sortMenuOpen = ref(null) // Для отслеживания открытого меню
  
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

  async function fetchIncomes() {
    try {
      loading.value = true
      error.value = null

      const sicretKey = 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie'
      
      const response = await axios.get('api/api', {
        params: {
          path: 'incomes',
          key: sicretKey,
          page: page.value,
          limit: filters.value.limit,
          dateFrom: filters.value.dateFrom, 
          dateTo: filters.value.dateTo   
        }
      })
      console.log("incomes: ", response.data.data)
      incomes.value = response.data.data
      totalPages.value = Math.ceil(response.data.meta.total / limit.value)
      
    } catch (err) {
      error.value = `Ошибка ${err.response?.status || 400}: ${err.response?.data?.message || 'Неверный запрос'}`
      console.error('Детали ошибки:', err.config)
    } finally {
      loading.value = false
    }
  }

    // Функция для сортировки текущей страницы
  function applySort(field, income) {
    sortField.value = field
    sortIncomes.value = income
    sortMenuOpen.value = null // Закрываем меню после выбора
    
    // Сортируем данные текущей страницы
    incomes.value.sort((a, b) => {
      // Приводим значения к числам, если это числовые поля
      let valueA = a[field]
      let valueB = b[field]
      
      if (field === 'quantity') {
        valueA = parseFloat(valueA) || 0
        valueB = parseFloat(valueB) || 0
      }
      
      if (income === 'asc') {
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
    sortIncomes.value = null
    sortMenuOpen.value = null
    // Здесь нужно перезагрузить данные в исходном порядке
    fetchIncomes()
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

    // Функция применения фильтров
  function applyFilters(newFilters = {}) {
    page.value = 1 // Сбрасываем на первую страницу при изменении фильтров
    filters.value = {
      ...filters.value,
      ...newFilters
    }
    limit.value = filters.value.limit
    fetchIncomes()
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
    incomes,
    loading,
    error,
    page,
    totalPages,
    filters,
    limitOptions,
    sortField,
    sortIncomes,
    sortMenuOpen,
    fetchIncomes, 
    nextPage,
    prevPage,
    applyFilters,
    resetFilters,
    applySort,
    toggleSortMenu,
    clearSort
  }
})