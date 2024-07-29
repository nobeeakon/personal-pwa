<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to='/'>home</RouterLink>&nbsp;|&nbsp;
    <RouterLink to='/shop'>shop</RouterLink>&nbsp;|&nbsp;
    <RouterLink to='/timeline'>timeline</RouterLink>
  </nav>
  <RouterView/>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
