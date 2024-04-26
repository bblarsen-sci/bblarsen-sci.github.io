<script>
export default {
  data() {
    return {
    };
  },
  mounted() {
    
  },
};
</script>

<template>
  <div class="relative">
    <div aria-hidden="true" class="absolute top-0 left-0 right-0 h-72 z-[-1] opacity-40 pointer-events-none">
    <div style="animation-delay:0.8s;animation-duration:2s" class="fade-in bg-waves">
    <canvas class="bg-waves" ></canvas>
  </div>
  </div>
</div>
  <div class="flex flex-col items-center justify-center h-screen " > 
    <div class="text-center mx-auto inline-block">
      <button class="py-2 text-xl pointer-events-none leading-tight tracking-tight text-slate-600 font-semibold">
        Brendan Larsen
      </button>
      <h1 class="leading-tight tracking-tight z-10 text-4xl pb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#0EA5E9] to-[#c772ba] font-bold relative -top-px pointer-events-none">Scientist / Biologist / Naturalist</h1>
      <p class="text-lg leading-tight tracking-tight font-light text-slate-500">I study the evolution of viruses.</p>
    </div>
    </div>
    <div class="h-1 bg-gradient-to-r from-sky-500 to-[#c772ba]"></div>

  <div class="bg-white/90 backdrop-blur backdrop-filter sticky top-0 py-6">
    <div class="flex items-center space-x-4 justify-between gap-4 text-slate-500">
    <a class="inline-flex flex-1 justify-center">Current</a>
    <a class="inline-flex flex-1 justify-center">Past</a>
    <a class="inline-flex flex-1 justify-center">Interests</a>
    </div>
    
  </div>
  
  
  <div class="flex flex-col items-center justify-center h-screen bg-virus dark:bg-sky-dark">
  </div>
</template>



  
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
</style>