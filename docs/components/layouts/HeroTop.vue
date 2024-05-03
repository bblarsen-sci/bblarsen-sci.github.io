<template>
  <div class="dark:bg-slate-900">
    <div class="absolute top-0 left-0 right-0 h-72 opacity-80">
        <div style="animation-delay:0.4s; animation-duration:2.5s" class="fade-in bg-layeredpeaks"></div>
    </div>
    <section class="flex flex-col items-center justify-center h-screen">
      <div class="text-center mx-auto inline-block">
        <div class="text-4xl md:text-4xl lg:text-4xl 2xl:text-6xl font-semibold leading-8 tracking-tight text-slate-500 dark:text-slate-400 ">
        Brendan Larsen
        </div>

        <p class="text-2xl md:text-2xl lg:text-2xl 2xl:text-4xl font-semibold leading-8 tracking-tight py-4 md:py-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-400 to-sky-400 ">
          Studying Viral Evolution
        </p>
      </div>
    </section>
    <section class="p-6 lg:p-10 lg:mx-4 rounded-md bg-white dark:bg-slate-900">
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