<template>
  <div class="app">
    <header>
      <nav>
        <router-link to="/orders">Заказы</router-link>
        <router-link to="/incomes">Доходы</router-link>
        <router-link to="/sales">Продажи</router-link>
        <router-link to="/stocks">Склады</router-link>
      </nav>
    </header>
    
    <!-- Это критически важно - здесь будут отображаться страницы -->
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f0f0f0;
}

.router-link-active {
  font-weight: bold;
  color: #42b983;
}
</style>