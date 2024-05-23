<!-- sidebar.vue -->

<template>
  <div class="sticky top-0 p-4 w-full overflow-hidden border-2 justify-center items-center inline-block">
    <div class="flex flex-col gap-4 text-xs">
      <div class="font-bold text-xl">Heatmap Options</div>

      <div class="flex flex-col">
        <label class="font-semibold" for="siteInput">Enter Specific Sites:</label>
        <input class="form-input" @input="$emit('update:siteInputValue', $event.target.value)"
          placeholder="e.g., 1-2,3">
        <button class="mt-2 btn-primary" @click="$emit('update:selectedSites', parseSites(siteInputValue))">Update
          Sites</button>
      </div>

      <div class="flex flex-col">
        <label class="font-semibold">Select Padding:</label>
        <select class="form-select" v-model="paddingValue">
          <option v-for="padding in heatmapOptions.paddingOptions">{{ padding }}</option>
        </select>
      </div>

      <div class="flex flex-col">
        <label class="font-semibold">Select Stroke:</label>
        <select class="form-select" v-model="strokeWidthValue">
          <option v-for="stroke in heatmapOptions.strokeOptions">{{ stroke }}</option>
        </select>
      </div>

      <div class="flex flex-col">
        <label class="font-semibold">Select Rows:</label>
        <select class="form-select" v-model="rows">
          <option v-for="row in heatmapOptions.rowOptions">{{ row }}</option>
        </select>
      </div>

      <div class="flex flex-col">
        <label class="font-semibold">Change Color:</label>
        <select class="form-select" v-model="selectedColorScale">
          <option v-for="color in heatmapOptions.colorOptions">{{ color }}</option>
        </select>
      </div>

      <div class="flex flex-col gap-2 mt-10">
        <button class="btn-primary" @click="$emit('downloadSVG')">Download SVG</button>
        <button class="btn-primary" @click="$emit('downloadImage')">Download PNG</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const rows = defineModel('rows');
const paddingValue = defineModel('paddingValue');
const strokeWidthValue = defineModel('strokeWidthValue');
const selectedColorScale = defineModel('selectedColorScale');

const emit = defineEmits(['downloadSVG', 'downloadImage', 'update:selectedSites', 'update:siteInputValue']);

const heatmapOptions = defineProps({
  strokeOptions: {
    type: Array,
    required: true
  },
  paddingOptions: {
    type: Array,
    required: true
  },
  colorOptions: {
    type: Array,
    required: true
  },
  rowOptions: {
    type: Array,
    required: true
  },
  siteInputValue: {
    type: String,
    required: true
  },
  selectedSites: {
    type: Array,
    required: true
  },
  parseSites: {
    type: Function,
    required: true
  }
});
</script>

<style scoped>
.form-input {
  @apply p-1 rounded-md ring-1 ring-slate-400;
}

.form-select {
  @apply p-1 rounded-md ring-1 ring-slate-400;
}

.btn-primary {
  @apply p-1 bg-sky-500 text-white rounded-md hover:bg-sky-600;
}
</style>