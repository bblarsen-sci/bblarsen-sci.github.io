<!-- sidebar.vue -->
<template>
  <div class="container w-40 items-center justify-center overflow-hidden border-2 p-2 text-xs">
    <div class="flex flex-col">
      <div class="text-lg font-bold">
        <slot name="title">Heatmap Options</slot>
      </div>
      <slot name="content"></slot>
      <div class="mt-4 flex flex-col">
        <button class="btn-primary" @click="$emit('downloadSVG')">Download SVG</button>
        <button class="btn-primary" @click="$emit('downloadImage')">Download PNG</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['downloadSVG', 'downloadImage']);
</script>