<template>
  <div class="field" :style="{ width: `${width * 2}em` }">
    <Cell type="has0" state="open" />
    <Cell type="has1" state="open" />
    <Cell type="has2" state="open" />
    <Cell type="has3" state="open" />
    <Cell type="has4" state="open" />
    <Cell type="has5" state="open" />
    <Cell type="has6" state="open" />
    <Cell type="has7" state="open" />
    <Cell type="has8" state="open" />
    <Cell type="mine" state="open" />
    <Cell type="has0" state="unknown" />
    <Cell type="has1" state="unknown" />
    <Cell type="has2" state="unknown" />
    <Cell type="has3" state="unknown" />
    <Cell type="has4" state="unknown" />
    <Cell type="has5" state="unknown" />
    <Cell type="has6" state="unknown" />
    <Cell type="has7" state="unknown" />
    <Cell type="has8" state="unknown" />
    <Cell type="mine" state="unknown" />
    <Cell type="has0" state="question" />
    <Cell type="has1" state="question" />
    <Cell type="has2" state="question" />
    <Cell type="has3" state="question" />
    <Cell type="has4" state="question" />
    <Cell type="has5" state="question" />
    <Cell type="has6" state="question" />
    <Cell type="has7" state="question" />
    <Cell type="has8" state="question" />
    <Cell type="mine" state="question" />
    <Cell type="has0" state="flag" />
    <Cell type="has1" state="flag" />
    <Cell type="has2" state="flag" />
    <Cell type="has3" state="flag" />
    <Cell type="has4" state="flag" />
    <Cell type="has5" state="flag" />
    <Cell type="has6" state="flag" />
    <Cell type="has7" state="flag" />
    <Cell type="has8" state="flag" />
    <Cell type="mine" state="flag" />
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import Cell from "./Cell.vue";
export default defineComponent({
  components: {
    Cell
  },
  props: {
    width: {
      type: Number as PropType<number>,
      default: 10
    },
    height: {
      type: Number as PropType<number>,
      default: 10
    }
  }
});
</script>
<style lang="scss" scoped>
.field {
  display: flex;
  flex-wrap: wrap;
}
</style>
