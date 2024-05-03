<template>
    <div class="lg:mx-4">
        <div class="rounded-sm lg:rounded-lg px-2 py-8 lg:px-12 bg-slate-800 text-slate-400 text-md md:text-lg lg:text-xl font-light">
            <div>
                <div class="text-white text-2xl lg:text-4xl font-extrabold">Current Projects</div>
                <div id="section-1" class="pt-4 text-xl lg:text-2xl font-semibold">Deep Mutational Scanning of the Nipah Receptor Binding Protein</div>
            </div>
            <div class="md:px-12 lg:px-48">
                <div class="flex flex-col flex-wrap items-center">
                    <NipahPhylogeny />
                    <div class="-mt-10 md:-mt-20 text-center text-xs md:text-sm lg:text-md">Phylogeny of Nipah colored by country of origin. Based on whole genome sequences.</div>
                </div>
                <div class="mt-14">Nipah is a bat-borne virus that occasionally spills over into humans. Nipah virus expresses two surface proteins: the receptor binding and fusion proteins. The receptor binding protein attaches to human host receptors, ephrin-B2 and ephrin-B3. Following receptor binding, the receptor binding protein undergoes a conformational shift, which triggers the fusion protein to fuse viral and cell membranes. These processes lead to viral entry into host cells. To better understand these processes, I performed deep mutational scanning on the receptor binding protein and measured the effects of mutations on cell entry and receptor binding in a BSL-2 pseudovirus platform.</div>
                <div class="flex justify-evenly lg:grid-cols-2 items-center text-center pt-12">
                    <p class=" max-w-96">Structure of the tetrameric receptor binding protein colored by the mean effect of mutations on cell entry. Darker red indicates sites with low tolerance for mutations.</p>
                    <img src="/images/entry_tetramer_better.png" class="max-w-48 lg:max-w-96 element-hidden">
                </div>
                <div class="mt-14 text-center">The receptor binding protein is also an important target for neutralizing antibodies, which have shown effectiveness in preventing disease in animal models.</div>
                <div class="flex justify-evenly lg:grid-cols-2 items-center text-center mt-14 gap-2">
                    <img src="/images/escape.png" class="max-h-60 md:max-h-96 element-hidden">
                    <p class="max-w-96"> Logo plot showing how receptor binding protein mutations affect neutralization by two different monoclonal antibodies. The height of each letter represents antibody escape, colored by functional tolerance. </p>
                </div>
                <div class="leading-tight text-center mt-14 tracking-tight text-2xl lg:text-4xl pb-10 bg-clip-text text-transparent bg-gradient-to-r from-[#AAABB8] to-red-500 font-semibold drop-shadow-xl ">These data aid in the development of vaccines and antibody therapies, in addition to improving basic understanding of the function of the receptor binding protein.</div>
                <div class="flex justify-evenly text-center pt-14 tracking-wide uppercase gap-10">
                    <a class=" hover:text-sky-600 " href="https://dms-vep.org/Nipah_Malaysia_RBP_DMS/">Link to project website</a>
                    <a class=" hover:text-sky-600 " href="https://www.biorxiv.org/content/10.1101/2024.04.17.589977v1">Link to preprint</a>
                </div>
            </div>
        </div>
        <div class="rounded-sm lg:rounded-lg px-2 py-8 lg:px-12 bg-slate-400 dark:bg-slate-700 text-slate-800 dark:text-slate-400 text-md md:text-lg lg:text-xl font-light">
            <div>
                <div class="text-white text-2xl lg:text-4xl font-extrabold">Past Projects</div>
                <div id="section-2" class="pt-4 text-xl lg:text-2xl font-semibold">Evolution and Diversity of Paramyxoviruses in Bats and Rodents</div>
            </div>
            <div class="md:px-12 lg:px-48">
                <div class="pt-14 lg:pt-20 grid grid-cols-2 gap-8">
                    <div class="flex items-center col-span-2 justify-center text-center">
                        <p class="litems-center justify-center"> Paramyxoviruses are widespread and extremely diverse, including notable human pathogens such as Nipah and Measles viruses. To better understand viral diversity, I captured hundreds of individual animals from 19 bat and 15 rodent species across Arizona. I successfully sequenced and analyzed 55 novel paramyxoviruses, adding to our knowledge of these viruses.</p>
                    </div>
                    <div class="flex justify-center items-center element-hidden">
                        <img src="/images/pallid.jpg" class="max-h-96">
                    </div>
                    <div class="flex justify-center items-center element-hidden">
                        <img src="/images/peromyscus.png" class="max-w-full max-h-64 lg:max-h-96 " alt="Escape">
                    </div>
                    <div class="flex items-center justify-center text-center col-span-2 mt-14">
                        <p class="">Through this sequencing effort, we uncovered the long-term evolutionary history of these viruses. A comparison of bat and virus phylogenies reveals similar branching patterns, suggesting a long-standing association that spans millions of years. This relationship highlights the intricate evolutionary dynamics between hosts and their viruses.</p>
                    </div>
                    <div class="flex items-center justify-center col-span-2 pt-14 ">
                        <img class="max-w-full max-h-96 element-hidden" src="/images/pmv_co_phylogeny.jpg"></img>
                    </div>
                    <nav class="flex col-span-2 justify-center text-center py-14  tracking-wide uppercase">
                        <a class=" hover:text-sky-600 " href="https://pubmed.ncbi.nlm.nih.gov/34668771/">Link to paper</a>
                    </nav>
                </div>
            </div>
            <div class="h-1 bg-slate-800 dark:bg-slate-600"></div>
            <div>
                <div class="pt-4 text-xl lg:text-2xl font-semibold">Early evolution and spread of SARS-CoV-2</div>
            </div>
            <div class="md:px-12 lg:px-48">
                <div class="mt-14 grid grid-cols-2 gap-8">
                    <div class="flex items-center justify-center text-center col-span-2">
                        <p class="items-center justify-center"> During the initial stages of the SARS-CoV-2 pandemic, I helped sequence and analyze phylogenetic patterns of early introductions and spread across various geographic regions.</p>
                    </div>
                    <div class="flex justify-center items-center element-hidden pt-14">
                        <img src="/images/mbio_phylogeny.jpg" class="max-h-96"></img>
                    </div>
                    <div class="flex justify-center items-center  text-center pt-14">
                        <p class=""> <a href="https://pubmed.ncbi.nlm.nih.gov/32887735/" class="hover:text-sky-600 underline">In a collaboration with scientists across Arizona</a>, we sequenced many of the earliest COVID-19 cases identified in March 2020. Our analysis focused on determining the number of distinct introductions during this period.</p>
                    </div>
                    <div class="flex items-center justify-center text-center col-span-2 pt-14">
                        <p class="">I also contributed to a <a href="https://pubmed.ncbi.nlm.nih.gov/32912998/" class="hover:text-sky-600 underline">study published in Science</a> that investigated various phylogenetic hypotheses regarding the initial introductions into the United States and Europe.</p>
                    </div>
                    <div class="flex items-center justify-center col-span-2">
                        <img class="max-w-full max-h-96 element-hidden" src="/images/370_564_f1.jpeg"></img>
                    </div>
                    <div class="flex items-center justify-center pt-14 text-center">
                        <p>Finally, by examining publicly released sequences on GISAID, <a href="https://virological.org/t/phylogenetic-evidence-that-b-1-1-7-has-been-circulating-in-the-united-states-since-early-to-mid-november/598" class="hover:text-sky-500 underline">we were able to estimate</a> when the alpha variant, B.1.1.7, entered the United States.</p>
                    </div>
                    <div class="flex items-center justify-center pt-14">
                        <img src="/images/b1117.png" class="max-w-full max-h-96 element-hidden"></img>
                    </div>
                </div>
            </div>
            <div class="h-1 bg-slate-800 dark:bg-slate-400 mt-14 lg:mx-0"></div>
            <div>
                <div class="pt-4 text-xl lg:text-2xl font-semibold">Ancient DNA</div>
            </div>
            <div class="md:px-12 lg:px-48"> 
                <div class="container pt-14 grid grid-cols-2 gap-8">
                    <div class="flex items-center justify-center text-center col-span-2">
                        <p class="items-center justify-center"> The long-term evolutionary history of many viral lineages is poorly understood.</p>
                    </div>
                    <div class="flex justify-center items-center element-hidden pt-14">
                        <img src="/images/midden.png" class="max-w-full max-h-96"></img>
                    </div>
                    <div class="flex justify-center items-center pt-14">
                        <p class="text-center"> Ancient DNA can be used to better understand the long-term evolution of viruses. I turned to a novel source of aDNA, packrat middens, which are collections of feces and plant matter deposited by rodents in the genus Neotoma across the SW United States. The image on the left shows one from 27,000 years ago.</p>
                    </div>
                    <div class="flex items-center justify-center text-center col-span-2 pt-14">
                        <p class="">I was able to sequence small DNA fragments of papillomamviruses from these ancient middens. By comparing with modern sequences, I demonstrated that papillomavirus have been infecting rodents for tens of millions of years.</p>
                    </div>
                </div> 
            </div>
        </div>
        <div id="section-3" class="">
            <div class="rounded-sm lg:rounded-lg px-2 py-24 lg:p-12 relative bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200">
                <div class="absolute top-2 left-2 lg:top-4 lg:left-6 text-4xl font-extrabold ">Interests</div>
                <div class="flex flex-col pt-16 lg:pt-20 gap-8 text-lg lg:text-2xl leading-loose font-light">
                    <p class="text-center">Viral Evolution and Diversity</p>
                    <p class="text-center">Mammal Biodiversity</p>
                    <p class="text-center">Coevolution</p>
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