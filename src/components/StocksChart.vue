<script setup>
import { ref } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

// Регистрируем только самое необходимое
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  stocks: {
    type: Array,
    required: true
  }
})

const chartData = {
  labels: props.stocks.map(stock => stock.barcode),
  datasets: [
    {
      label: 'Товары в пути от клиента',
      backgroundColor: '#f87979',
      data: props.stocks.map(stock => parseInt(stock.in_way_from_client))
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
        text: 'кол-во от клиента'
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