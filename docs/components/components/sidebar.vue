<!-- sidebar.vue -->
<template>
  <div class="sticky top-0 inline-block items-center justify-center overflow-hidden border p-2 text-xs">
    <div class="flex flex-col gap-2">
      <div class="text-lg font-bold">
        <slot name="title">Heatmap Options</slot>
      </div>
      <slot name="content"></slot>
      <div class="mt-6 flex flex-col gap-2">
        <button class="btn-primary" @click="$emit('downloadSVG')">Download SVG</button>
        <button class="btn-primary" @click="$emit('downloadImage')">Download PNG</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['downloadSVG', 'downloadImage']);
</script>