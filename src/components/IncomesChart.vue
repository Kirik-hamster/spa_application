<script setup>
import { ref } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

// Регистрируем только самое необходимое
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  incomes: {
    type: Array,
    required: true
  }
})

const chartData = {
  labels: props.incomes.map(income => income.barcode),
  datasets: [
    {
      label: 'Колличество проданного товара',
      backgroundColor: '#f87979',
      data: props.incomes.map(income => parseInt(income.quantity))
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
        text: 'штрихкод товара'
      }
    },
    y: {
      title: {
        display: true,
        text: 'колличество продано'
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