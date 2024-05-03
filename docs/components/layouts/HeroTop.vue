<template>
  <div class="dark:bg-slate-900">
    <div class="absolute top-0 left-0 right-0 h-72 opacity-80">
        <div style="animation-delay:0.8s; animation-duration:2s" class="fade-in bg-waves"></div>
    </div>
    <section class="flex flex-col items-center justify-center h-screen">
      <div class="text-center mx-auto inline-block">
        <div class="text-2xl md:text-2xl lg:text-4xl font-semibold leading-tight tracking-tight text-slate-600 dark:text-slate-400 ">
        Brendan Larsen
        </div>
        <div class="text-xl md:text-2xl lg:text-4xl font-semibold leading-tight tracking-tight py-4 md:py-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-400 to-sky-600 ">
          Scientist / Biologist
        </div>
        <p class="text-lg md:text-xl lg:text-2xl leading-tight tracking-tight text-slate-400 dark:text-slate-400">
          Studying the evolution of viruses.
        </p>
      </div>
    </section>
    <section class="p-6 lg:p-10 lg:mx-4 rounded-md">
      <div class="text-sm lg:text-xl flex justify-evenly text-slate-500 dark:text-slate-400 tracking-widest uppercase">
        <a class=" hover:text-sky-600" href="#section-1">Current</a>
        <a class=" hover:text-sky-600" href="#section-2">Past</a>
        <a class=" hover:text-sky-600" href="#section-3">Interests</a>
      </div>
    </section>  
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