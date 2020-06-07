<template>
  <div class="wrapper">
    <button @click="field = init(row, col)">
      <img src="@/assets/logo.png" height="20" width="20" />
    </button>
    <span v-if="state !== 'Game'">{{ state }}</span>
    <div>
      <SelectNumber v-model:value="row">
        <template #label>
          <span>Row:</span>
        </template>
      </SelectNumber>
      <SelectNumber v-model:value="col">
        <template #label>
          <span>Col:</span>
        </template>
      </SelectNumber>
      <SelectNumber v-model:value="mine" :max="row * col - 1">
        <template #label>
          <span>Mine:</span>
        </template>
      </SelectNumber>
    </div>
    <div class="field">
      <template v-for="(row, rIndex) in field">
        <div class="row" :key="rIndex">
          <template v-for="(cell, cIndex) in row">
            <Cell
              :type="cell.cell"
              :state="cell.state"
              :key="`${rIndex}-${cIndex}`"
              @open="open(rIndex, cIndex)"
              @change="change(rIndex, cIndex)"
              @open-around="openAround(rIndex, cIndex)"
            />
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import Cell from "./Cell.vue";
import SelectNumber from "./SelectNumber.vue";
import {
  initializerFactory,
  MineField,
  openCell,
  toGameState,
  changeState,
  openAround
} from "@/domain";
export default defineComponent({
  components: {
    Cell,
    SelectNumber
  },
  setup() {
    const row = ref(1);
    const col = ref(1);
    const mine = ref(1);
    const init = computed(() => initializerFactory([], mine.value));
    const field = ref<MineField>([]);
    const state = computed(() => toGameState(field.value));
    onMounted(() => {
      row.value = 10;
      col.value = 10;
      mine.value = 10;
      field.value = init.value(row.value, col.value);
    });
    return {
      mine,
      row,
      col,
      init,
      field,
      open(row: number, col: number) {
        if (state.value !== "Game") return;
        field.value = openCell(field.value, row, col);
      },
      change(row: number, col: number) {
        if (state.value !== "Game") return;
        field.value = changeState(field.value, row, col);
      },
      openAround(row: number, col: number) {
        if (state.value !== "Game") return;
        field.value = openAround(field.value, row, col);
      },
      state
    };
  }
});
</script>
<style lang="scss" scoped>
.field {
  display: flex;
  flex-direction: column;

  > .row {
    display: flex;
  }
}
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
