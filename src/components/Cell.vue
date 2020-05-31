<template>
  <div
    class="cell-area"
    :class="{ '--opened': isOpen, [type]: true, [state]: true }"
    v-text="contents"
    @click.left="open"
    @click.right="change"
    @click.middle="aroundOpen"
    oncontextmenu="return false;"
  />
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { CellState, CellType, isNotOpen, isHavingMine } from "@/domain/";

export default defineComponent({
  props: {
    type: {
      type: String as PropType<CellType>,
      default: "has0"
    },
    state: {
      type: String as PropType<CellState>,
      default: "unknown"
    }
  },
  setup(props, { emit }) {
    const cell = computed(() =>
      props.state === "open" ? props.type : props.state
    );
    const isOpen = computed(() => props.state === "open");
    const isHasMine = computed(
      () => props.type !== "mine" && props.type !== "has0"
    );
    const contents = computed(() =>
      (!isOpen.value && props.state !== "question") ||
      (isOpen.value && (props.type === "has0" || props.type === "mine"))
        ? ""
        : cell.value === "question"
        ? "?"
        : cell.value.replace("has", "")
    );
    return {
      isOpen,
      contents,
      open() {
        if (cell.value === "unknown") emit("open");
      },
      change() {
        if (props.state !== "open") emit("change");
      },
      openAround() {
        if (isHasMine.value) emit("open-around");
      }
    };
  }
});
</script>
<style lang="scss" scoped>
.cell-area {
  border: 1px solid black;
  border-collapse: collapse;
  line-height: 2em;
  width: 2em;
  height: 2em;
  background: #eee;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  font-weight: bold;
  color: green;
  &.--opened {
    background: #fff;
  }
  &.unknown:hover {
    background: rgba($color: #fff, $alpha: 0.5);
  }
  &.flag:not(.--opened) {
    background-image: url("./../assets/flag.png");
    background-size: cover;
  }
  &.mine.--opened {
    background-image: url("./../assets/logo.png");
    background-size: cover;
  }
}
</style>
