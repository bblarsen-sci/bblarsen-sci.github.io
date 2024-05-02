---
layout: page
---

<script>
export default {
  data() {
    return {
      observer: null,  
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
            <img src="/images/nipah_phylogeny.png" class="pb-6 relative element-hidden max-w-full max-h-96 lg:max-h-[600px]"></img>
          </div>
          <div class="-mt-8 flex col-span-2 items-center justify-center text-center element-hidden">Phylogeny of Nipah sequences from nature, with receptor binding protein mutations mapped on. </div>
          <div class="flex items-center justify-center text-center">
            <p class="element-hidden">Nipah is a bat-borne virus that occasionally spills over into humans. The virus's receptor binding protein attaches to human host receptors, ephrin-B2 and ephrin-B3. Through deep mutational scanning, I have explored how nearly every possible mutation affects both cell entry and receptor binding. The accompanying diagram illustrates the impact of these mutations on cell entry; areas marked in red indicate sites with low tolerance for mutations. </p>
          </div>
          <div class="flex justify-center items-center ">
            <img src="/images/entry_tetramer_better.png" class="max-w-full max-h-96 element-hidden">
          </div>
          <div class="flex justify-center items-center ">
            <img src="/images/escape.png" class="max-w-full max-h-96 element-hidden">
          </div>
          <div class="flex items-center justify-center text-center">
            <p class="element-hidden">The receptor binding protein is an important target for neutralizing antibodies, which have shown effectiveness in preventing disease in animal models. Using deep mutational scanning, I have identified mutations that allow the virus to evade these antibodies. Understanding these escape mutations helps us pinpoint which changes impact antibody neutralization and whether these mutations are functionally tolerated. </p>
          </div>
          <div class="mt-12 flex col-span-2 items-center justify-center h-full text-center">
            <div class="leading-tight tracking-tight text-2xl lg:text-4xl pb-10 bg-clip-text text-transparent bg-gradient-to-r from-[#AAABB8] to-red-500 font-semibold relative drop-shadow-xl element-hidden">These data aid in the development of vaccines and antibody therapies, in addition to improving basic understanding of the function of the receptor binding protein.</div>
          </div>
          <nav class="flex items-center col-span-2 px-10 pt-10 -space-x-2 justify-between text-slate-500 dark:text-slate-400 tracking-widest">
            <a class="inline-flex flex-1 justify-center items-center hover:text-sky-500 hover:font-bold" href="https://dms-vep.org/Nipah_Malaysia_RBP_DMS/">Link to website with more information</a>
            <a class="inline-flex flex-1 justify-center hover:text-sky-500 hover:font-bold" href="https://www.biorxiv.org/content/10.1101/2024.04.17.589977v1">Link to preprint</a>
          </nav>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="section-2" class="lg:px-4 overflow-hidden">
  <div class="rounded-md lg:rounded-2xl px-6 py-24 lg:p-12 relative bg-slate-400 dark:bg-slate-600 text-slate-800 dark:text-slate-200">
    <div class="absolute top-2 left-2 lg:top-4 lg:left-6 text-4xl font-extrabold text-white">Past Projects</div>
    <div class="absolute top-12 lg:top-16 left-2 lg:left-6 text-lg lg:text-2xl">Evolution and Diversity of Paramyxoviruses in Bats and Rodents</div>
    <div class="container pt-16 lg:pt-20 grid grid-cols-2 gap-8 text-md md:text-lg lg:text-2xl leading-loose font-extralight">
      <div class="flex items-center col-span-2 justify-center text-center">
        <p class="litems-center justify-center  element-hidden"> Paramyxoviruses are widespread and extremely diverse, including notable human pathogens such as Nipah and Measles viruses. To explore this diversity, I captured hundreds of individual animals from 19 bat and 15 rodent species across Southeastern Arizona. I successfully sequenced and analyzed 55 novel paramyxoviruses, adding to our knowledge of these viruses.</p>
      </div>
      <div class="flex justify-center items-center element-hidden">
        <img src="/images/pallid.jpg" class="max-h-96">
      </div>
      <div class="flex justify-center items-center element-hidden">
        <img src="/images/peromyscus.png" class="max-w-full max-h-64 lg:max-h-96 " alt="Escape">
      </div>
      <div class="flex items-center justify-center text-center col-span-2">
        <p class="element-hidden">Through this sequencing effort, we uncovered the long-term evolutionary history of these viruses. A comparison of bat and virus phylogenies reveals similar branching patterns, suggesting a long-standing association that spans millions of years. This relationship highlights the intricate evolutionary dynamics between hosts and their viruses.</p>
      </div>
      <div class="flex items-center justify-center col-span-2">
        <img class="max-w-full max-h-96" src="/images/pmv_co_phylogeny.jpg"></img>
      </div>
      <div class="flex items-center justify-center col-span-2">
        <img class="max-w-full max-h-96" src="/images/pmv_circular_phylogeny.png"></img>
      </div>
      <nav class="flex items-center col-span-2 px-10 -space-x-2 justify-between text-slate-500 dark:text-slate-400 tracking-widest">
            <a class="inline-flex flex-1 justify-center hover:text-sky-500 hover:font-bold" href="https://pubmed.ncbi.nlm.nih.gov/34668771/">Link to paper</a>
      </nav>
    </div>
  </div>

  <div class="h-1 m-4 bg-slate-600"></div>
  <div class="rounded-md lg:rounded-2xl px-6 py-24 lg:p-12 relative bg-slate-400 dark:bg-slate-600 text-slate-600 dark:text-slate-400">    
    <div class="absolute top-12 lg:top-16 left-2 lg:left-6 font-semibold text-lg lg:text-2xl">Early evolution and spread of SARS-CoV-2</div>
    <div class="container pt-16 lg:pt-20 grid grid-cols-2 gap-8 text-md md:text-lg lg:text-2xl leading-loose font-light">
      <div class="flex items-center justify-center text-center col-span-2">
        <p class="items-center justify-center element-hidden"> During the initial stages of the SARS-CoV-2 pandemic, I helped sequence and analyze phylogenetic patterns that marked the virus’s early spread and introductions across various global regions.</p>
      </div>
      <div class="flex justify-center items-center element-hidden">
        <img src="/images/mbio_phylogeny.jpg" class="max-w-full max-h-96"></img>
      </div>
      <div class="flex justify-center items-center element-hidden">
        <p class=""> <a href="https://pubmed.ncbi.nlm.nih.gov/32887735/" class="hover:text-sky-500 hover:font-bold">In a collaboration with scientists across Arizona</a>, we sequenced many of the earliest COVID-19 cases identified in March 2020. Our analysis focused on determining the number of distinct viral introductions during this period.</p>
      </div>
      <div class="flex items-center justify-center text-center col-span-2">
        <p class="element-hidden">Furthermore, I contributed to a <a href="https://pubmed.ncbi.nlm.nih.gov/32912998/" class="hover:text-sky-500 hover:font-bold">study published in Science</a> that investigated various phylogenetic hypotheses concerning the virus’s initial introductions into the United States and Europe.</p>
      </div>
      <div class="flex items-center justify-center col-span-2">
        <img class="max-w-full max-h-96" src="/images/370_564_f1.jpeg"></img>
      </div>
      <div class="flex items-center justify-center">
        <p>Finally, by examining publicly released sequences on GISAID, <a href="https://virological.org/t/phylogenetic-evidence-that-b-1-1-7-has-been-circulating-in-the-united-states-since-early-to-mid-november/598" class="hover:text-sky-500 hover:font-bold">we were able to estimate the early introductions</a> of the alpha variant, B.1.1.7, into the United States.</p>
      </div>
      <div class="flex items-center justify-center">
        <img src="/images/b1117.png" class="max-w-full max-h-96"></img>
      </div>
    </div> 
  </div>
  <div class="h-1 bg-slate-600 m-4"></div>
  <div class="rounded-md lg:rounded-2xl px-6 py-24 lg:p-12 relative bg-slate-400 dark:bg-slate-600 text-slate-600 dark:text-slate-400">    
    <div class="absolute top-12 lg:top-16 left-2 lg:left-6 font-semibold text-lg lg:text-2xl">Ancient DNA</div>
    <div class="container pt-16 lg:pt-20 grid grid-cols-2 gap-8 text-md md:text-lg lg:text-2xl leading-loose font-light">
      <div class="flex items-center justify-center text-center col-span-2">
        <p class="items-center justify-center element-hidden"> The long-term evolutionary history of many viral lineages is poorly understood.</p>
      </div>
      <div class="flex justify-center items-center element-hidden">
        <img src="/images/midden.png" class="max-w-full max-h-96"></img>
      </div>
      <div class="flex justify-center items-center element-hidden">
        <p class=""> Ancient DNA can be used to better understand the long-term evolution of viruses. I turned to a novel source of aDNA, packrat middens, which are collections of feces and plant matter deposited by rodents in the genus Neotoma across the SW United States. The image on the left shows one from 27,000 years ago.</p>
      </div>
      <div class="flex items-center justify-center text-center col-span-2">
        <p class="element-hidden">I was able to sequence small DNA fragments of papillomamviruses from these ancient middens. By comparing with modern sequences, I was able to show that papillomavirus have been infecting rodents for tens of millions of years.</p>
      </div>
    </div> 
  </div>
</section>

<section id="section-3" class="lg:px-4 overflow-hidden">
  <div class="rounded-md lg:rounded-2xl px-6 py-24 lg:p-12 relative bg-slate-200 dark:bg-slate-500 text-slate-800 dark:text-slate-200">
    <div class="absolute top-2 left-2 lg:top-4 lg:left-6 text-4xl font-extrabold ">Interests</div>
    <div class="container pt-16 lg:pt-20 grid grid-cols-1 gap-8 text-lg lg:text-2xl leading-loose font-light">
      <p class="flex items-center justify-center text-center">Viral Evolution and Diversity</p>
      <p class="flex items-center justify-center text-center">Mammal Biodiversity</p>
      <p class="flex items-center justify-center text-center">Coevolution</p>
      <p class="flex items-center justify-center text-center">Phylogenetics</p>
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