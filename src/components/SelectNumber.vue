<template>
  <label
    ><slot name="label" />
    <select :value="val" @change="update($event.target.value)">
      <option :value="i" v-for="i in options" v-text="i" :key="i" />
    </select>
  </label>
</template>
<script lang="ts">
import { defineComponent, computed, PropType } from "vue";
import { range } from "fp-ts/lib/Array";
export default defineComponent({
  props: {
    value: {
      type: Number as PropType<number>,
      default: 10
    },
    min: {
      type: Number as PropType<number>,
      default: 1
    },
    max: {
      type: Number as PropType<number>,
      default: 20
    }
  },
  setup(props, { emit }) {
    return {
      val: computed(() => props.value),
      options: computed(() => range(props.min, props.max)),
      update(val: string) {
        emit("update:value", parseInt(val, 10));
      }
    };
  }
});
</script>
