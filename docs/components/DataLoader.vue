<!-- DataLoader.vue -->
<template></template>

<script setup>
import { defineEmits } from 'vue';
import * as d3 from 'd3';

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['data-loaded']);

async function fetchData() {
  const csv = await d3.csv(props.url);
  emit('data-loaded', csv);
}
fetchData();
</script>
