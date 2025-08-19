<script setup>
import { ref } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

// Регистрируем только самое необходимое
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  sales: {
    type: Array,
    required: true
  }
})

const chartData = {
  labels: props.sales.map(sale => sale.barcode),
  datasets: [
    {
      label: 'Сумма продаж товара',
      backgroundColor: '#f87979',
      data: props.sales.map(sale => sale.total_price)
    }
  ]
}

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
    scales: {
    x: {
      title: {
        display: true,
        text: 'Штрихкод'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Сумма (руб)'
      }
    }
  }
})

</script>

<template>
  <div class="chart-container">
    <Bar 
      :data="chartData" 
      :options="chartOptions"
    />
  </div>
</template>

<style scoped>
.chart-container {
  height: 300px;
}
</style>