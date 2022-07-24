<template>
  <MenuApp msg="Menu"/>
</template>

<script>
import MenuApp from './components/MenuApp.vue'

export default {
  name: 'App',
  components: {
    MenuApp
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
