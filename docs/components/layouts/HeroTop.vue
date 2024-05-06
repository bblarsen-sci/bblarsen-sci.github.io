<template>
  <div class="h-screen mx-auto flex flex-col justify-center items-center text-center ">
    <HeatmapTenBlocks />
    <div class="max-w-screen-xl mt-4">
      <div class="text-2xl font-semibold">Brendan Larsen</div>
      <div class=" text-4xl xl:text-4xl uppercase font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-sky-700 via-slate-300 ">Viral Evolution and Diversity</div>
    </div>
      <div class=" mt-12 text-sm md:text-lg flex flex-row justify-center gap-10 lg:gap-20 uppercase">
        <a class="tracking-wider opacity-70 hover:text-sky-500" href="/about">About</a>
        <a class="tracking-wider opacity-70 hover:text-sky-500" href="/publications">Publications</a>
        <a class="tracking-wider opacity-70 hover:text-sky-500" href="/code_pages/code_index">Code</a>
      </div>
  </div>
</template>

<script setup>
import HeatmapTenBlocks from "/components/graphs/HeatmapTenBlocks.vue";

</script>

<style>
.fade-in {
  width: 100%;
  height: 100%;
  animation-delay: 0.6s;
  animation-duration: 1s;
}
.fade-in {
  opacity: 0;
  -webkit-animation: fade-in .5s ease;
  animation: fade-in .5s ease;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}
.hero-gradient {
  background: linear-gradient(45deg, #0ea5e9, #64748b);
  background-size: 400% 400%;
  animation: gradientAnimation 10s ease infinite;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>