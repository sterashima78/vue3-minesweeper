<template>
  <Minesweeper />
  <a href="https://github.com/sterashima78/vue3-minesweeper">View code</a>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Minesweeper from "./components/Minesweeper.vue";
export default defineComponent({
  name: "App",
  components: {
    Minesweeper
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
a {
  padding-top: 15px;
  display: inline-block;
}
</style>
