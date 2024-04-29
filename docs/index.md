---
# https://vitepress.dev/reference/default-theme-home-page
layout: page
---

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

<section class="absolute top-0 left-0 right-0 h-72 z-[-1] opacity-80">
  <div style="animation-delay:0.8s; animation-duration:2s" class="fade-in bg-waves"></div>
</section>

<section class="flex flex-col items-center justify-center h-screen">
  <div class="text-center mx-auto inline-block">
    <div class=" text-4xl leading-tight tracking-tight text-slate-600 dark:text-slate-400 font-semibold">
      Brendan Larsen
    </div>
    <div class="leading-tight tracking-tight z-10 text-4xl py-6 bg-clip-text text-transparent bg-gradient-to-r from-[#AAABB8] to-[#2E9CCA] font-semibold relative">
      Scientist / Biologist
    </div>
    <p class="text-xl  leading-tight tracking-tight font-light text-slate-400 dark:text-slate-400">
      Studying the evolution of viruses.
    </p>
  </div>
</section>

<section class="bg-slate-400/90 dark:bg-slate-700 backdrop-blur backdrop-filter p-4 lg:mx-4 md:p-6 rounded-md lg:rounded-2xl border-slate-600 border-2">
    <nav class="flex items-center px-10 -space-x-2 justify-between text-slate-500 dark:text-slate-400 tracking-widest">
        <a class="inline-flex flex-1 justify-center hover:text-sky-500 hover:font-bold" href="#section-1">Current</a>
        <a class="inline-flex flex-1 justify-center hover:text-sky-500 hover:font-bold" href="#section-2">Past</a>
        <a class="inline-flex flex-1 justify-center hover:text-sky-500 hover:font-bold" href="#section-3">Interests</a>
    </nav>
</section>




<section id="section-1"> 
  <div class="lg:px-4">
    <div class="rounded-md lg:rounded-2xl px-6 py-24 lg:p-12 relative bg-slate-800 text-slate-400">
      <div class="absolute top-2 left-2 lg:top-6 lg:left-6 text-white text-4xl font-extrabold">Current Projects</div>
      <div class="absolute top-12 left-2 lg:top-20 lg:left-6  text-lg lg:text-2xl">Deep Mutational Scanning of the Nipah Receptor Binding Protein</div>
      <div class="container pt-6 lg:pt-20 ">
        <div class="grid grid-cols-2 gap-8 font-light leading-loose tracking-wide text-md md:text-lg lg:text-2xl">
          <div class=" lg:pt-12 flex col-span-2 items-center justify-center text-center">
            <img src="/images/nipah_phylogeny.png" class="pb-6 relative element-hidden max-w-full max-h-96 lg:max-h-screen"></img>
          </div>
          <div class="-mt-8 flex col-span-2 items-center justify-center text-center element-hidden">Phylogeny of Nipah sequences from nature, with receptor binding protein mutations mapped on. </div>
          <div class="flex items-center justify-center text-center">
            <p class="element-hidden">Nipah is a bat-borne virus that occasionally spills over into humans. The receptor binding protein binds the host receptors ephrin-B2 and ephrin-B3. I used deep mutational scanning to map the effects of nearly every mutation on cell entry and receptor binding for both host receptors. The structure to the right shows the average effects of mutations at each site on cell entry, with red representing sites with poor tolerance to mutations. </p>
          </div>
          <div class="flex justify-center items-center ">
            <img src="/images/entry_tetramer_better.png" class="max-w-full max-h-96 element-hidden">
          </div>
          <div class="flex justify-center items-center ">
            <img src="/images/escape.png" class="max-w-full max-h-96 element-hidden">
          </div>
          <div class="flex items-center justify-center text-center">
            <p class="element-hidden">The receptor binding protein is also an important target of neutralizing antibodies, which can prevent disease in animal models. I mapped mutations that escape neutralization by different monoclonal antibodies. This allows us to determine which mutations affect neutralization, and whether the mutations are tolerated. </p>
          </div>
          <div class="mt-12 flex col-span-2 items-center justify-center h-full text-center">
            <div class="leading-tight tracking-tight text-2xl lg:text-4xl pb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#AAABB8] to-red-500 font-semibold relative drop-shadow-xl element-hidden">These data aid in the development of vaccines and antibody therapies by prospectively mapping effects of mutations on different phenotypes.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="section-2" class="lg:px-4 overflow-hidden">
  <div class="rounded-md lg:rounded-2xl px-6 py-24 lg:p-12 relative bg-slate-200 text-slate-600">
    <div class="absolute top-2 left-2 lg:top-4 lg:left-6 text-4xl font-extrabold">Past Projects</div>
    <div class="absolute top-12 lg:top-16 left-2 lg:left-6 text-lg lg:text-2xl">Evolution and Diversity of Paramyxoviruses in Bats and Rodents</div>
    <div class="container pt-16 lg:pt-20 grid grid-cols-2 gap-8 text-md md:text-lg lg:text-2xl leading-loose font-extralight">
      <div class="flex items-center col-span-2 justify-center text-center">
        <p class="litems-center justify-center  element-hidden"> Paramyxoviruses are widespead and extremely diverse, and contain notable human pathogens such as Nipah and Measles. I captured hundreds of individual animals from 19 bat species and 15 rodent species across SE Arizona. From these samples, I was able to sequence and analyze 55 novel paramyxoviruses.</p>
      </div>
      <div class="flex justify-center items-center element-hidden">
        <img src="/images/pallid.jpg" class="max-h-96">
      </div>
      <div class="flex justify-center items-center element-hidden">
        <img src="/images/peromyscus.png" class="max-w-full max-h-64 lg:max-h-96 " alt="Escape">
      </div>
      <div class="flex items-center justify-center text-center col-span-2">
        <p class="element-hidden">By sequencing these paramyxoviruses, we are able to determine the long-term evolutionary history of these viruses. Comparison of the the bat and viral phylogenies show they share similar branching patterns, suggestive of a long-term association that spans millions of years.</p>
      </div>
      <div class="flex items-center justify-center col-span-2">
        <img class="max-w-full max-h-96" src="/images/pmv_co_phylogeny.jpg"></img>
      </div>
    </div>
    
  </div>
  <div class="h-1 bg-slate-600"></div>
  <div class="rounded-md lg:rounded-2xl px-6 py-24 lg:p-12 relative bg-slate-400 text-slate-600">    
    <div class="absolute top-12 lg:top-16 left-2 lg:left-6 font-semibold text-lg lg:text-2xl">Early evolution and spread of SARS-CoV-2</div>
    <div class="container pt-16 lg:pt-20 grid grid-cols-2 gap-8 text-md md:text-lg lg:text-2xl leading-loose font-light">
      <div class="flex items-center justify-center text-center col-span-2">
        <p class="items-center justify-center element-hidden"> During the early stages of the SARS-CoV-2 pandemic, I was highly involved in sequencing and analyzing phylogenetic patterns of early spread and introductions in different parts of the world.</p>
      </div>
      <div class="flex justify-center items-center element-hidden">
        <img src="/images/mbio_phylogeny.jpg" class="max-w-full max-h-96"></img>
      </div>
      <div class="flex justify-center items-center element-hidden">
        <p class=""> In a large collaboration across Arizona, we sequenced many of the earliest cases and analyzed how many separate introductions there were during March 2020.</p>
      </div>
      <div class="flex items-center justify-center text-center col-span-2">
        <p class="element-hidden">I was also involved in a study in Science that examined different phylogenetic hypotheses regarding early introductions into the United States and Europe.</p>
      </div>
      <div class="flex items-center justify-center col-span-2">
        <img class="max-w-full max-h-96" src="/images/370_564_f1.jpeg"></img>
      </div>
      <div class="flex items-center justify-center">
        <p>Also, by analyzing publically released sequences on GISAID, we were able to estimate early introductions of the alpha variant B.1.1.7 into the United States</p>
      </div>
      <div class="flex items-center justify-center">
        <img src="/images/b1117.png" class="max-w-full max-h-96"></img>
      </div>
    </div> 
  </div>
</section>

<style scoped>
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