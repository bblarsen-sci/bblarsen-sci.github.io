<script>
export default {
  data() {
    return {
      observer: null,  // We'll store the intersection observer instance here
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
  <html class=" ">
    <div class="relative">
      <div aria-hidden="true" class="absolute top-0 left-0 right-0 h-72 z-[-1] opacity-80 pointer-events-none">
        <div style="animation-delay:1.0s; animation-duration:2.5s" class="fade-in bg-waves">
          <canvas class="bg-waves"></canvas>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center justify-center h-screen ">
      <div class="text-center mx-auto inline-block">
        <button class="py-6 text-2xl pointer-events-none leading-tight tracking-tight text-slate-600 dark:text-slate-400 font-semibold">
          Brendan Larsen
        </button>
        <h1 class="leading-tight tracking-tight z-10 text-4xl pb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#AAABB8] to-[#2E9CCA] font-semibold relative -top-px pointer-events-none">
          Scientist / Biologist / Naturalist
        </h1>
        <p class="text-lg py-6 leading-tight tracking-tight font-light text-slate-400 dark:text-slate-400">
          Studying the evolution of viruses.
        </p>
      </div>
    </div>
    <div class="h-1 bg-slate-600"></div>

    <div class="flex items-center justify-center h-screen bg-virus relative px-10 md:px-20 lg:px-40">
      <div class="absolute top-0 left-0 p-4">
          <span id='section-1' class="text-white text-6xl">Current Projects</span>
      </div>
    <div class="flex justify-between w-full">
        <!-- Left Column for two boxes -->
        <div class="flex flex-col pr-12">
            <div class="bg-[#EFEFEF] element-hidden p-2 mb-10"> <!-- Adjust margin as needed -->
                <p class="text-xl leading-tight tracking-tight text-slate-800 dark:text-slate-400 font-semibold">
                    Deep mutational scanning of the Nipah receptor binding protein
                </p>
                <p class="text-lg text-slate-600 dark:text-slate-400 font-light">
                    The Nipah receptor binding protein utilizes the host receptors ephrin-B2 and ephrin-B3 to enter cells. Extensive details...
                </p>
            </div>
            <div class="bg-[#EFEFEF] element-hidden p-2">
                <p class="text-xl leading-tight tracking-tight text-slate-800 dark:text-slate-400 font-semibold">
                    Second Box Title
                </p>
                <p class="text-lg text-slate-600 dark:text-slate-400 font-light">
                    Additional description for the second box, detailing more projects or content.
                </p>
            </div>
        </div>

        <!-- Right Box -->
        <div class="bg-[#EFEFEF] element-hidden p-2 self-center"> <!-- `self-center` aligns this box vertically center relative to the two left boxes -->
            <p class="text-xl leading-tight tracking-tight text-slate-800 dark:text-slate-400 font-semibold">
                Intermediate Box Title
            </p>
            <p class="text-lg text-slate-600 dark:text-slate-400 font-light">
                This box contains information that sits between the top and bottom boxes on the left in terms of content hierarchy.
            </p>
        </div>
    </div>
</div>

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