<script>
  export default {
    data() {
      return {
        visibleElements: new Set(), // This will keep track of which elements are visible
      };
    },
    mounted() {
      this.initObserver();
    },
    methods: {
      initObserver() {
        const options = {
          root: null,
          threshold: 0.1,
          rootMargin: '0px'
        };
  
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            const id = entry.target.dataset.id;
            if (entry.isIntersecting) {
              this.visibleElements.add(id);
            } else {
              this.visibleElements.delete(id);
            }
            this.$forceUpdate(); // Ensure Vue reacts to Set changes
          });
        }, options);
  
        this.observeElements();
      },
      observeElements() {
        const elements = document.querySelectorAll('[data-id]');
        elements.forEach(element => this.observer.observe(element));
      }
    },
    beforeDestroy() {
      if (this.observer) {
        this.observer.disconnect();
      }
    },
    computed: {
      isVisible() {
        // This computed property will help in checking visibility in the template
        return (id) => this.visibleElements.has(id);
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
        <div class="lg:px-4 overflow-hidden">
          <div class="rounded-md lg:rounded-2xl px-6 py-24 lg:p-12 relative bg-slate-800">
            <div class="absolute top-2 left-2 lg:top-6 lg:left-6 text-white text-4xl font-extrabold">Current Projects</div>
            <div class="absolute top-12 left-2 lg:top-20 lg:left-6 text-slate-400 text-lg lg:text-2xl">Deep Mutational Scanning of the Nipah Receptor Binding Protein</div>
            <div class="container pt-6 lg:pt-20 ">
              <div class="grid grid-cols-2 gap-8  text-slate-600 dark:text-slate-400 text-sm">
                
                <a class="flex items-center justify-center h-full text-center text-md lg:text-2xl text-slate-400" href="https://dms-vep.org/Nipah_Malaysia_RBP_DMS/">
                  <p class="m-2 leading-loose font-light ">Nipah is a bat-borne virus that occasionally spills over into humans. The Nipah receptor binding protein attaches to cells to mediate entry into cells. I used deep mutational scanning to map the effects of nearly every mutation on cell entry and receptor binding.</p>
                </a>
                
                <div class="flex justify-center items-center ">
                  <img src="/images/entry_tetramer_better.png" class="max-w-full max-h-96">
                </div>
                
                <div class="flex justify-center items-center ">
                  <img src="/images/escape.png" class="max-w-full max-h-96">
                </div>
                
                <div class="flex items-center justify-center h-full font-light text-center text-md lg:text-2xl text-slate-400">
                  <template v-if="isVisible('element-id')">
                    <p class="m-2 leading-loose ">The receptor binding protein is also an important target of neutralizing antibodies, which can prevent disease. I mapped mutations that escape different monoclonal antibodies.</p>
                  </template>
                </div>
                
                <div class="mt-12 flex col-span-2   items-center justify-center h-full text-center  ">
                  <div class="leading-tight tracking-tight z-10 text-2xl lg:text-4xl pb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#AAABB8] to-red-500 font-semibold relative drop-shadow-xl">These data aid in the development of vaccines and antibody therapies prospectively by mapping which mutations are tolerated. </div>
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