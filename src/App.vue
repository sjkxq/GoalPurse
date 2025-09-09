<template>
  <div id="app">
    <nav class="navbar">
      <router-link to="/" class="nav-link" :class="{ active: $route.name === 'Goals' }">
        目标
      </router-link>
      <router-link to="/statistics" class="nav-link" :class="{ active: $route.name === 'Statistics' }">
        统计
      </router-link>
      <router-link to="/settings" class="nav-link" :class="{ active: $route.name === 'Settings' }">
        设置
      </router-link>
    </nav>
    
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
// 应用根组件
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.navbar {
  display: flex;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 0 30px;
}

.nav-link {
  padding: 20px 25px;
  text-decoration: none;
  color: #666;
  font-weight: 500;
  font-size: 18px;
  position: relative;
  transition: all 0.3s;
}

.nav-link.active {
  color: #409eff;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #409eff;
}

main {
  padding: 25px 0;
}
</style>