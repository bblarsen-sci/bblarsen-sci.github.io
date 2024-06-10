<!-- Tooltip.vue -->
<template>
    <div
      class="tooltip"
      :style="{ top: `${y}px`, left: `${x}px` }"
      v-if="visible && data"
    >
      <p class="tooltip-text" v-for="(item, index) in data" :key="index">
        {{ item.label }}: {{ item.value }}
      </p>
    </div>
  </template>
  
<script setup>
import { ref } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const visible = ref(false);
const x = ref(0);
const y = ref(0);

function showTooltip(event) {
  visible.value = true;
  x.value = event.clientX + 10;
  y.value = event.clientY + 10;
}

function hideTooltip() {
  visible.value = false;
}

defineExpose({
  showTooltip,
  hideTooltip,
});
</script>

<style scoped>
.tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  text-align: center;
  color: white;
  padding: 5px;
  border-radius: 5px;
  pointer-events: none;
  z-index: 9999;
  border: 1px solid black;
}
.tooltip-text {
  font-size: 12px;
}
</style>
  
  