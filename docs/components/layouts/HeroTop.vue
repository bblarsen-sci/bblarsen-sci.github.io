<template>
  <div class="dark:bg-slate-950 ">
    <div class="absolute top-0 left-0 right-0 h-72 opacity-80">
        <div style="animation-delay:0.4s; animation-duration:2.5s" class="fade-in"></div>
    </div>
    <section class="flex flex-col items-center justify-center h-screen">
      <div class="text-center">
        <div class="font-semibold md:text-lg lg:text-xl 2xl:text-2xl tracking-widest text-black dark:text-slate-300 ">
        Brendan Larsen
        </div>

        <p class="text-4xl 2xl:text-6xl pt-2 font-semibold tracking-tight uppercase bg-clip-text text-transparent  bg-gradient-to-r from-red-700 to-sky-700 via-slate-300 ">
           Viral Evolution and Diversity
        </p>
      </div>
    </section>
    <section class="p-6 lg:p-10 lg:mx-4 rounded-md bg-white dark:bg-slate-950">
      <div class="text-sm lg:text-xl flex justify-evenly text-slate-600 dark:text-slate-400 tracking-widest uppercase">
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