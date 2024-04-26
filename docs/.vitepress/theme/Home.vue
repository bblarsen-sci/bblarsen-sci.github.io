<script>
export default {
  data() {
    return {
      observer: null,  // Store the intersection observer instance here
    };
  },
  mounted() {
    this.initObserver();
  },
  mounted() {
    this.initObserver();
  },
  methods: {
    initObserver() {
      const options = {
        root: null, // observing relative to viewport
        threshold: 0.1, // trigger when 10% of the element is visible
        rootMargin: '0px'
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('element-visible');
            entry.target.classList.remove('element-hidden');
          }
        });
      }, options);

      // Select elements and start observing them
      const elements = document.querySelectorAll('.element-hidden');
      elements.forEach(element => this.observer.observe(element));
    }
  },
  beforeDestroy() {
    if (this.observer) {
      // Stop observing all elements
      this.observer.disconnect();
    }
  }
};
</script>


<template>
  <html>
      
      <section class="absolute top-0 left-0 right-0 h-72 z-[-1] opacity-80 ">
        <div style="animation-delay:0.8s; animation-duration:2.5s" class="fade-in bg-waves">
        </div>
      </section>
      
      <section class="flex flex-col items-center justify-center h-screen">
        <div class="text-center mx-auto inline-block">
          <div class="pb-6 text-4xl pointer-events-none leading-tight tracking-tight text-slate-600 dark:text-slate-400 font-semibold">
            Brendan Larsen
          </div>
          <div class="leading-tight tracking-tight z-10 text-4xl pb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#AAABB8] to-[#2E9CCA] font-semibold relative ">
            Scientist / Biologist
          </div>
          <p class="text-xl pb-6 leading-tight tracking-tight font-light text-slate-400 dark:text-slate-400">
            Studying the evolution of viruses.
          </p>
        </div>
      </section>
      <div class="h-1 bg-slate-600"></div>
      <section class="bg-white/90 dark:bg-slate-700 backdrop-blur backdrop-filter p-6">
        <nav class="flex items-center space-x-4 justify-between text-slate-500 dark:text-slate-400 tracking-widest">
          <a class="inline-flex flex-1 justify-center hover:text-sky-500 hover:font-bold" href="#section-1">Current</a>
          <a class="inline-flex flex-1 justify-center hover:text-sky-500 hover:font-bold" href="#section-2">Past</a>
          <a class="inline-flex flex-1 justify-center hover:text-sky-500 hover:font-bold" href="#section-3">Interests</a>
        </nav>
      </section>
      
      <section> 
        <div class="px-0 lg:px-4 overflow-hidden">
          <div class="rounded-md lg:rounded-2xl px-6 py-24 lg:p-12 relative z-0 bg-virus">
            <div class="absolute top-2 left-2 text-white text-4xl font-extrabold">Current Projects</div>
            <div class="container">
              <div class="grid grid-flow-col grid-rows-2 grid-cols-2 gap-8 lg:gap-20 mt-4 md:mt-8 text-slate-600 dark:text-slate-400 text-md">
                <div class="bg-white element-hidden rounded-xl">
                  <p class="">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ultricies lacus sed turpis tincidunt. Suspendisse potenti nullam ac tortor vitae purus faucibus ornare. Proin sed libero enim sed.</p>
                </div>
                <div class="bg-white element-hidden rounded-xl">
                  <p class="">Tempor orci eu lobortis elementum nibh tellus molestie. Enim blandit volutpat maecenas volutpat blandit aliquam etiam erat velit. Erat nam at lectus urna duis. Enim facilisis gravida neque convallis a cras. Volutpat lacus laoreet non curabitur gravida arcu ac tortor dignissim. Volutpat maecenas volutpat blandit aliquam etiam erat. Sit amet mauris commodo quis imperdiet massa. Fermentum dui faucibus in ornare.</p>
                </div>
                <div class="bg-white element-hidden rounded-xl">
                  <p class="">Tempor orci eu lobortis elementum nibh tellus molestie. Enim blandit volutpat maecenas volutpat blandit aliquam etiam erat velit. Erat nam at lectus urna duis. Enim facilisis gravida neque convallis a cras. Volutpat lacus laoreet non curabitur gravida arcu ac tortor dignissim. Volutpat maecenas volutpat blandit aliquam etiam erat. Sit amet mauris commodo quis imperdiet massa. Fermentum dui faucibus in ornare.</p>
                </div>
                <div class="bg-white element-hidden rounded-xl">
                  <p class="">Tempor orci eu lobortis elementum nibh tellus molestie. Enim blandit volutpat maecenas volutpat blandit aliquam etiam erat velit. Erat nam at lectus urna duis. Enim facilisis gravida neque convallis a cras. Volutpat lacus laoreet non curabitur gravida arcu ac tortor dignissim. Volutpat maecenas volutpat blandit aliquam etiam erat. Sit amet mauris commodo quis imperdiet massa. Fermentum dui faucibus in ornare.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  </html>
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
.element-hidden {
    opacity: 0;
    transform: translateY(20px);
    transition: all 2.5s ease-out;
}
.element-visible {
    opacity: 1;
    transform: translateY(0);
    transition: all 2.5s ease-out;
}
</style>