<script setup>
import { ref, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

// Регистрируем только самое необходимое
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  orders: {
    type: Array,
    required: true
  }
})


const chartData = {
  labels: props.orders.map(order => order.date),
  datasets: [
    {
      label: 'Покупки по времени',
      backgroundColor: '#f87979',
      data: props.orders.map(order => parseFloat(order.total_price))
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
        text: 'Дата'
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