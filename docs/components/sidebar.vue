<!-- sidebar.vue -->
<template>
    <div class="sticky top-0 p-4 w-full overflow-hidden border-2 justify-center items-center inline-block">
        <div class="flex flex-col gap-6 text-xs font-light">
            <div class="font-bold text-xl">Heatmap Options</div>
            <div class="flex flex-col">
                <p>File must have four columns in csv: site, mutant, wildtype,effect</p>
                <p for="fileInput" class="mr-2 font-semibold">Upload CSV:</p>
                <input type="file" id="fileInput"  @change="$emit('update:handleFileUpload', $event)" accept=".csv" class="">
            </div>
            <div class="flex flex-col gap-2">
                <label class="font-semibold" for="siteInput">Enter Specific Sites:</label>
                <input type="text" id="siteInput" :value="siteInputValue" @input="$emit('update:siteInputValue', $event.target.value)" class="p-2 rounded-md ring-1 ring-slate-500"
                    placeholder="e.g., 1-2,3">
                <div id="updateSites" @click=" $emit('update:selectedSites', parseSites(siteInputValue))"
                    class="p-1 bg-sky-500 shadow-md shadow-sky-500 text-white rounded-md hover:ring-2 ring-sky-700 text-center ">
                    Update Sites</div>
            </div>
            <div class="flex flex-col">
                <label for="paddingSelect" class="mr-2 font-semibold">Select Padding:</label>
                <select id="paddingSelect" :value="paddingValue" @input="$emit('update:paddingValue', parseInt($event.target.value))" class="p-2 rounded-md bg-slate-200">
                    <option v-for="padding in paddingOptions" :value="padding" :key="padding">{{padding}}</option>
                </select>
            </div>
            <div class="flex flex-col">
                <label for="strokeSelect" class="mr-2 font-semibold">Select Stroke:</label>
                <select id="strokeSelect"  :value="strokeWidthValue" @input="$emit('update:strokeWidthValue', parseInt($event.target.value))" class="p-2 rounded-md bg-slate-200">
                    <option v-for="stroke in strokeOptions" :value="stroke" :key="stroke">{{stroke}}</option>
                </select>
            </div>
            <div class="flex flex-col">
                <label for="rowsSelect" class="mr-2 font-semibold">Select Rows:</label>
                <select id="rowsSelect" :value="rows" @input="$emit('update:rows', parseInt($event.target.value))" class="p-2 rounded-md bg-slate-200">
                    <option v-for="row in rowOptions" :value="row" :key="row">{{row}}</option>
                </select>
            </div>
            <div class="flex flex-col">
                <label class="mr-2 font-semibold">Change Color:</label>
                <select  :value="selectedColorScale" @input="$emit('update:selectedColorScale', $event.target.value)" class="p-2 rounded-md bg-slate-200">
                    <option v-for="color in colorOptions" :value="color" :key="color">{{color}}</option>
                </select>
            </div>
            <div class="flex flex-col gap-2">
                <button  @click="$emit('downloadSVG')"
                    class="px-3 py-2 bg-sky-500 shadow-sky-500 text-white rounded-md hover:bg-sky-600">Download
                    SVG</button>
                <button  @click="$emit('downloadImage')"
                    class="px-3 py-2 bg-sky-500  shadow-sky-500 text-white rounded-md hover:bg-sky-600">Download
                    PNG</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
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
  paddingValue: {
    type: Number,
    required: true
  },
  strokeWidthValue: {
    type: Number,
    required: true
  },
  rows: {
    type: Number,
    required: true
  },
  selectedColorScale: {
    type: String,
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
  handleFileUpload: {
    type: Function,
    required: true
  },
  parseSites: {
    type: Function,
    required: true
  },
  downloadSVG: {
    type: Function,
    required: true
  },
  downloadImage: {
    type: Function,
    required: true
  }
});
</script>