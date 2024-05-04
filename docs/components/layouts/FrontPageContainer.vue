<template>
    <div class="container mx-auto px-2">
        <div class="flex flex-row justify-evenly gap-4 md:gap-10 lg:gap-14 pb-4 text-sm tracking-wide uppercase text-slate-600 dark:text-slate-400">
            <a class=" hover:text-sky-500" href="#section-1">Current Projects</a>
            <a class=" hover:text-sky-500" href="#section-2">Past Projects</a>
            <a class=" hover:text-sky-500" href="#section-3">Interests</a>
        </div>
        <div class="p-4 xl:p-10 rounded-lg bg-sky-dark bg-no-repeat text-slate-200 text-md">
            <div>
                <div class="text-4xl 2xl:text-6xl font-extrabold tracking-tight">Current Projects</div>
                <div id="section-1" class="text-slate-400 tracking-tight text-2xl 2xl:text-4xl font-semibold">Deep Mutational Scanning of the Nipah Receptor Binding Protein</div>
            </div>
            <div class="px-14 md:px-48 xl:px-[300px] 2xl:px-[400px]">
                <div class="font-semibold text-2xl text-sky-400 pt-24">Nipah Virus</div>
                <div class="leading-8">Nipah is a bat-borne virus that occasionally spills over into humans, causing devastating disease and high fatality rates. There are currently no approved vaccines or therapeutics. The phylogeny below shows the evolutionary relationship between Nipah viruses.</div>
                <div class="flex flex-col items-center -pt-8">
                    <NipahPhylogeny class="aspect-square max-h-96" />   
                </div>
                <div class="pt-10 font-semibold text-2xl text-sky-400">Receptor Binding Protein</div>
                <div class="flex flex-col justify-center items-center">
                    <div class="leading-8"> Nipah virus expresses two surface proteins: the receptor binding and fusion proteins. The receptor binding protein can bind two different host receptors with high affinity: ephrin-B2 and ephrin-B3. Once bound, the receptor binding protein undergoes a conformational change, which triggers the fusion protein to merge viral and cell membranes, leading to viral entry into host cells. To better understand these processes, I performed deep mutational scanning on the receptor binding protein and measured the effects of all mutations on cell entry, receptor binding, and antibody escape with a BSL-2 pseudovirus platform.</div>
                </div>
                <div class="flex flex-col justify-center gap-2 items-center text-center pt-10">
                    <img src="/images/entry_tetramer_better.png" class="max-w-96 ">
                    <p class="text-sm">Structure of the tetrameric receptor binding protein colored by the mean effect of mutations on cell entry. Darker red indicates sites with low tolerance for mutations.</p>
                </div>
                <div class="pt-20 font-semibold text-2xl text-sky-400">Antibody Escape</div>
                <div class="leading-8">The receptor binding protein is also an important target for neutralizing antibodies, which have shown effectiveness in preventing disease in animal models. To better understand constraint across different epitopes, we prospectively mapped sites of escape for six antibodies. </div>
                <div class="flex flex-row justify-center items-center text-center py-16 gap-2">
                    <img src="/images/escape.png" class="max-h-80">
                    <p class="leading-tight text-sm"> Effect of mutations on antibody neutralization. The height of each letter represents antibody escape, colored by functional tolerance. </p>
                </div>
                <div class="leading-tight text-center py-24 tracking-tight text-2xl lg:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-slate-400 to-red-400 font-semibold">These data aid in the development of vaccines and antibody therapies, in addition to improving basic understanding of the function of the receptor binding protein.</div>
                <div class="flex text-sm justify-evenly text-center pt-10 tracking-wide uppercase gap-10">
                    <a class=" hover:text-sky-600 " href="https://dms-vep.org/Nipah_Malaysia_RBP_DMS/">Link to project website</a>
                    <a class=" hover:text-sky-600 " href="https://www.biorxiv.org/content/10.1101/2024.04.17.589977v1">Link to preprint</a>
                </div>
            </div>
        </div>
        <br class=""></br>
        <div class="rounded-lg lg:rounded-xl 2xl:rounded-2xl py-4 px-4 lg:py-10 lg:px-12 bg-lightblue  text-slate-300  text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl">
            <div>
                <div class="text-white dark:text-slate-200 text-2xl lg:text-2xl xl:text-4xl 2xl:text-6xl tracking-tight leading-tight font-extrabold">Past Projects</div>
                <div id="section-2" class="text-slate-400 leading-8 text-lg lg:text-xl xl:text-2xl 2xl:text-4xl font-semibold">Evolution and Diversity of Paramyxoviruses in Bats and Rodents</div>
            </div>
            <div class="md:px-24 lg:px-60 2xl:px-80">
                <div class="pt-14 lg:pt-20 grid grid-cols-2 gap-8">
                    <div class="flex items-center col-span-2 justify-center text-center">
                        <p class="items-center justify-center leading-8"> Paramyxoviruses are widespread and extremely diverse, including notable human pathogens such as Nipah and Measles. To better understand viral diversity across host species, I captured hundreds of individual animals from 19 bat and 15 rodent species across Arizona. From feces and urine samples collected from these animals, I identified 55 new viral sequences, including some nearly full-length genomes.</p>
                    </div>
                    <div class="flex justify-center items-center ">
                        <img src="/images/pallid.jpg" class="max-h-80 shadow-md ">
                    </div>
                    <div class="flex justify-center items-center ">
                        <img src="/images/peromyscus.png" class="max-w-full max-h-64 lg:max-h-96 shadow-md  " >
                    </div>
                    <div class="flex items-center justify-center text-center col-span-2 mt-14 leading-8">
                        <p class="">What is the phylogenetic history of these viruses? A comparison of bat and virus phylogenies reveals similar branching patterns, suggesting a long-standing association that spans millions of years. This relationship highlights the intricate evolutionary dynamics between hosts and their viruses.</p>
                    </div>
                    <div class="flex items-center justify-center col-span-2 pt-14 ">
                        <img class="max-w-full max-h-96  shadow-lg shadow-slate-400" src="/images/pmv_co_phylogeny.jpg"></img>
                    </div>
                    <nav class="flex col-span-2 justify-center text-center py-6  tracking-wide uppercase">
                        <a class=" hover:text-sky-600 " href="https://pubmed.ncbi.nlm.nih.gov/34668771/">Link to paper</a>
                    </nav>
                </div>
            </div>
            <div class="h-1 bg-slate-400"></div>
            <div>
                <div class="pt-4 text-lg lg:text-xl xl:text-2xl 2xl:text-4xl font-semibold">Early evolution and spread of SARS-CoV-2</div>
            </div>
            <div class="md:px-24 lg:px-60">
                <div class="mt-14 grid grid-cols-2 gap-8 leading-8">
                    <div class="flex items-center justify-center text-center col-span-2">
                        <p class="items-center justify-center leading-8"> During the initial stages of the SARS-CoV-2 pandemic, I helped sequence viral genomes and analyzed phylogenetic patterns of early introductions and spread across various geographic regions.</p>
                    </div>
                    <div class="flex justify-center items-center  pt-14">
                        <img src="/images/mbio_phylogeny.jpg" class="max-h-96 shadow-lg shadow-slate-400"></img>
                    </div>
                    <div class="flex justify-center items-center  text-center pt-14">
                        <p class="leading-8"> <a href="https://pubmed.ncbi.nlm.nih.gov/32887735/" class="hover:text-sky-600 underline">In a collaboration with scientists across Arizona (UA, ASU, NAU, TGen)</a>, we sequenced many of the earliest COVID-19 cases identified in March 2020. Our analysis focused on determining the number of distinct introductions during this period.</p>
                    </div>
                    <div class="flex items-center justify-center text-center col-span-2 pt-14">
                        <p class="">I also contributed to a <a href="https://pubmed.ncbi.nlm.nih.gov/32912998/" class="hover:text-sky-600 underline">study published in Science</a> that investigated various phylogenetic hypotheses regarding the initial introductions into the United States and Europe.</p>
                    </div>
                    <div class="flex items-center justify-center col-span-2">
                        <img class="max-w-full max-h-96 shadow-lg shadow-slate-400" src="/images/370_564_f1.jpeg"></img>
                    </div>
                    <div class="flex items-center justify-center pt-14 text-center">
                        <p>Finally, by examining publicly released sequences on GISAID, <a href="https://virological.org/t/phylogenetic-evidence-that-b-1-1-7-has-been-circulating-in-the-united-states-since-early-to-mid-november/598" class="hover:text-sky-500 underline">we were able to estimate</a> when the alpha variant, B.1.1.7, entered the United States.</p>
                    </div>
                    <div class="flex items-center justify-center pt-14">
                        <img src="/images/b1117.png" class="max-w-full max-h-96 shadow-lg shadow-slate-400"></img>
                    </div>
                </div>
            </div>
        </div>
        <br class="bg-white dark:bg-slate-950"></br>
        <div id="section-3" class="">
            <div class="rounded-lg lg:rounded-xl 2xl:rounded-2xl py-4 px-4 lg:py-10 lg:px-12 relative bg-sky-light dark:bg-slate-800 text-slate-400 ">
                <div class="absolute top-6 text-white text-2xl lg:text-2xl xl:text-4xl 2xl:text-6xl font-extrabold tracking-tight leading-tight">Interests</div>
                <div class="flex flex-col pt-16 lg:pt-20 gap-8 text-lg lg:text-2xl 2xl:text-4xl tracking-wide leading-loose font-light">
                    <p class="text-center">Viral Evolution and Diversity</p>
                    <p class="text-center">Mammal Biodiversity</p>
                    <p class="text-center">Host/Virus Coevolution</p>
                    <p class="text-center">Phylogenetics</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import NipahPhylogeny from "/components/graphs/PhylogeneticTree.vue";
import { ref, onMounted, onBeforeUnmount } from 'vue';


const observer = ref(null);

const initObserver = () => {
  const options = {
    root: null,
    threshold: 0.5,
    rootMargin: '0px'
  };

  observer.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('element-visible');
        entry.target.classList.remove('element-hidden');
      }
    });
  }, options);

  // Select elements and start observing them
  const elements = document.querySelectorAll('.element-hidden');
  elements.forEach(element => observer.value.observe(element));
};

onMounted(() => {
  initObserver();
});

onBeforeUnmount(() => {
  if (observer.value) {
    // Stop observing all elements
    observer.value.disconnect();
  }
});
</script>

<style>
.element-hidden {
  opacity: 0;
  transform: translateY(30px);
  transition: all 3s ease-out;
}

.element-visible {
  opacity: 1;
  transform: translateY(0);
  transition: all 3s ease-out;
}
</style>