<!-- sidebar.vue -->
<template>
  <div class="sidebar">
    <div class="flex flex-col gap-2">
      <div class="text-xl font-bold">Heatmap Options</div>
        <label class="font-semibold" for="siteInput">Enter Specific Sites:</label>
        <input
          class="form-input"
          @input="$emit('update:siteInputValue', $event.target.value)"
          placeholder="e.g., 1-2,3"
        />
        <button
          class="btn-primary"
          @click="$emit('update:selectedSites', parseSites(siteInputValue))"
        >
          Update Sites
        </button>
        <label class="test">Select Padding:</label>
        <select class="form-select" v-model="paddingValue">
          <option v-for="padding in heatmapOptions.paddingOptions">{{ padding }}</option>
        </select>
        <label class="">Select Stroke:</label>
        <select class="form-select" v-model="strokeWidthValue">
          <option v-for="stroke in heatmapOptions.strokeOptions">{{ stroke }}</option>
        </select>
        <label class="">Select Rows:</label>
        <select class="form-select" v-model="rows">
          <option v-for="row in heatmapOptions.rowOptions">{{ row }}</option>
        </select>
        <label class="">Change Color:</label>
        <select class="form-select" v-model="selectedColorScale">
          <option v-for="color in heatmapOptions.colorOptions">{{ color }}</option>
        </select>
      <div class="mt-10 flex flex-col gap-2">
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

const emit = defineEmits([
  'downloadSVG',
  'downloadImage',
  'update:selectedSites',
  'update:siteInputValue',
]);

const heatmapOptions = defineProps({
  strokeOptions: {
    type: Array,
    required: true,
  },
  paddingOptions: {
    type: Array,
    required: true,
  },
  colorOptions: {
    type: Array,
    required: true,
  },
  rowOptions: {
    type: Array,
    required: true,
  },
  siteInputValue: {
    type: String,
    required: true,
  },
  selectedSites: {
    type: Array,
    required: true,
  },
  parseSites: {
    type: Function,
    required: true,
  },
});
</script>


