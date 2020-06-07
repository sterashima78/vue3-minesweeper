<template>
  <Minesweeper />
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import Minesweeper from "./components/Minesweeper.vue";
import { initializerFactory, MineField, openCell, toGameState } from "@/domain";
export default defineComponent({
  name: "App",
  components: {
    Minesweeper
  },
  setup() {
    const row = ref(10);
    const col = ref(10);
    const mine = ref(10);
    const init = computed(() => initializerFactory([], mine.value));
    const field = ref<MineField>(init.value(row.value, col.value));
    return {
      mine,
      row,
      col,
      init,
      field,
      open({ row, col }: { row: number; col: number }) {
        field.value = openCell(field.value, row, col);
      },
      state: computed(() => toGameState(field.value))
    };
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
</style>
