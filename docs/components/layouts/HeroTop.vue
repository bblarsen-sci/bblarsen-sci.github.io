<template>
  <div class="h-screen mx-auto flex flex-col justify-center items-center text-center ">
    <heatmapTenBlocks />
    <div class="max-w-screen-xl mt-12">
      <div class="text-2xl font-semibold">Brendan Larsen</div>
      <div
        class=" text-4xl xl:text-4xl uppercase font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-sky-700 via-slate-300 ">
        Viral Evolution and Diversity</div>
    </div>
    <div class="mt-12 text-sm md:text-lg flex flex-row justify-center gap-10 lg:gap-20 uppercase">
      <a class="tracking-wider opacity-70 hover:text-sky-500" href="/about">About</a>
      <a class="tracking-wider opacity-70 hover:text-sky-500" href="/publications">Publications</a>
      <a class="tracking-wider opacity-70 hover:text-sky-500" href="/code_pages/code_index">Visualizations</a>
    </div>
  </div>
</template>

<script setup>
import heatmapTenBlocks from "/components/graphs/heatmapBlocksAnimatedExtended.vue";
</script>

<style>

</style>