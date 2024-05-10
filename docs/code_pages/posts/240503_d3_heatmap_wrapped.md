---
layout: page
title: D3 heatmap wrapped
aside: false
date: 2024-05-03
keywords:
    - D3
subtext: Heatmap of deep mutational scanning data that is wrapped in multiple rows
---


<script setup>
import HeatmapWrapped from "/components/graphs/HeatmapWrapped.vue";
</script>

<div class="container px-4 py-8">
  <div class="max-w-md mx-auto mb-8">
    <div class="bg-white shadow-md rounded-lg p-6 text-left">
      <h2 class="text-2xl font-bold mb-4 ">Heatmap of Mutational Effects on Cell Entry</h2>
      <p class="mb-4 ">I wanted to figure out how to make wrapped heatmaps with D3 that visualize deep mutational scanning data. Here is my attempt. There are a few dropdown menus below to change the appearance of the heatmap, such as:</p>
      <ul class="mb-6 justify-between flex flex-col">
        <li class="inline-block mr-2 bg-gray-200 text-gray-700 px-3 py-1 rounded">Padding white borders around</li>
        <li class="inline-block mr-2 bg-gray-200 text-gray-700 px-3 py-1 rounded">Stroke black borders around</li>
        <li class="inline-block mr-2 bg-gray-200 text-gray-700 px-3 py-1 rounded">Rows how many rows will the wrapped in</li>
        <li class="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded">Color scheme the color schem heatmap</li>
      </ul>
      <h3 class="text-xl font-bold mb-2 ">Load your own data</h3>
      <p class="mb-4 ">The default heatmap shows cell entry data for the Nipah receptor binding protein. To visualize your own data, upload a .csv where the following columns are present:</p>
      <ul class="mb-4  justify-between flex flex-col">
        <li class="mr-4">site</li>
        <li class="mr-4">wildtype</li>
        <li class="mr-4">mutant</li>
        <li>effect</li>
      </ul>
      <p class="text-sm text-gray-600">Right now this heatmap only works on functional cell entry data, but maybe I'll figure out how to map escape and/or receptor binding where values below a certain cutoff are masked.</p>
    </div>
  </div>
  <br> </br>
  <div class="mt-52">
    <HeatmapWrapped />
  </div>
</div>

