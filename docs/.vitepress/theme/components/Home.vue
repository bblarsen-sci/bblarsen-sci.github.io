<template>
  <div class="mx-auto flex h-screen flex-col items-center justify-center text-center align-middle">
    <h2 class="">Brendan Larsen</h2>
    <h1
      class="bg-gradient-to-r from-red-700 via-slate-300 to-sky-700 bg-clip-text text-transparent"
    >
      Viral Evolution and Diversity
    </h1>
    <div class="flex flex-row gap-8 uppercase tracking-wider">
      <a class="inline-flex flex-1 justify-center border-none" href="/about">About</a>
      <a class="inline-flex flex-1 justify-center border-none" href="/publications">Pubs</a>
      <a class="inline-flex flex-1 justify-center border-none" href="/visualizations">Visuals</a>
    </div>
  </div>
  <div class="px-0">
    <div class="flex items-center justify-between gap-2 pb-4 text-center uppercase tracking-wider">
      <a class="inline-flex flex-1 justify-center border-none" href="#section-1"
        >Current Projects</a
      >
      <a class="inline-flex flex-1 justify-center border-none" href="#section-2">Past Projects</a>
    </div>
    <div class="bg-sky-dark bg-no-repeat p-4 text-slate-300 sm:rounded-lg">
      <div class="col-span-12 col-start-1 lg:col-span-10">
        <h1 class="text-white">Current Projects</h1>
        <h2 id="section-1" class="text-slate-300">
          Deep Mutational Scanning of the Nipah Receptor Binding Protein
        </h2>
      </div>
      <div class="mx-auto max-w-screen-sm">
        <div class="items-left justify-between text-left">
          <h3 class="text-sky-400">Nipah Virus</h3>
          <p class="">
            Nipah is a bat-borne virus that occasionally spills over into human populations, causing
            severe disease with high fatality rates. Currently, there are no approved vaccines or
            therapeutics available for the prevention or treatment of Nipah virus infection.
          </p>
          <phylogeneticTreeRadial class="container mx-auto max-w-[450px]" />
          <figcaption class="text-center">Phylogenetic tree of Nipah viruses</figcaption>
          <h3 class="text-sky-400">Receptor Binding Protein</h3>
          <p class="">
            Nipah virus expresses two surface proteins: the receptor binding protein and the fusion
            protein. The receptor binding protein can bind two different host receptors, ephrin-B2
            and ephrin-B3, with high affinity. Once bound, the receptor binding protein undergoes a
            conformational change, which triggers the fusion protein to merge the viral and cell
            membranes, leading to viral entry into host cells. To better understand these processes,
            I performed deep mutational scanning on the receptor binding protein and measured the
            effects of all mutations on cell entry, receptor binding, and antibody escape using a
            BSL-2 pseudovirus platform.
          </p>
          <img
            src="/images/entry_tetramer_better.png"
            class="element-hidden container mx-auto w-80 lg:w-96"
          />
          <figcaption class="text-center text-slate-300">
            Structure of the tetrameric receptor binding protein colored by the mean effect of
            mutations on cell entry. Darker red indicates sites with low tolerance for mutations.
          </figcaption>
          <h3 class="text-sky-400">Antibody Escape</h3>
          <p class="">
            The receptor binding protein is also an important target for neutralizing antibodies,
            which have shown effectiveness in preventing disease in animal models. To better
            understand constraint across different epitopes, we prospectively mapped sites of escape
            for six antibodies.
          </p>
          <div class="flex flex-row items-center justify-center gap-4 text-center">
            <img src="/images/antibody_escape-01.jpg" class="max-h-80 rounded-lg bg-slate-200" />
            <figcaption class="text-slate-300">Sites of antibody escape.</figcaption>
          </div>
          <h2
            class="bg-gradient-to-r from-slate-200 to-sky-400 bg-clip-text py-10 text-center tracking-tight text-transparent"
          >
            These data aid in the development of vaccines and antibody therapies, in addition to
            improving basic understanding of the function of the receptor binding protein.
          </h2>
          <div class="flex items-center justify-between pb-4 text-center uppercase tracking-wider">
            <a
              class="0 inline-flex flex-1 justify-center border-none text-slate-300"
              href="https://dms-vep.org/Nipah_Malaysia_RBP_DMS/"
              >Link to project website</a
            >
            <a
              class="inline-flex flex-1 justify-center border-none text-slate-300"
              href="https://www.biorxiv.org/content/10.1101/2024.04.17.589977v1"
              >Link to preprint</a
            >
          </div>
        </div>
      </div>
    </div>
    <div class="py-12"></div>
    <div class="prose-dark prose prose-invert bg-red bg-no-repeat p-4 text-slate-300 sm:rounded-lg">
      <div class="col-span-12 col-start-1 lg:col-span-10">
        <h1 class="text-white">Past Projects</h1>
        <h2 id="section-2" class="text-slate-200">
          Evolution and Diversity of Paramyxoviruses in Bats and Rodents
        </h2>
      </div>
      <div class="container mx-auto max-w-screen-sm">
        <div class="items-left relative justify-between text-left">
          <h3 class="text-red-400">Paramyxoviruses</h3>
          <p>
            Paramyxoviruses are widespread and extremely diverse, including notable human pathogens
            such as Nipah and measles viruses. To better understand viral diversity across host
            species, I captured hundreds of individual animals from 19 bat and 15 rodent species
            across Arizona. From feces and urine samples collected from these animals, I identified
            55 new viral sequences, including some nearly full-length genomes.
          </p>
          <div class="flex flex-wrap items-center justify-evenly align-middle">
            <img
              src="/images/pallid.jpg"
              class="aspect-square max-h-60 rounded-full object-cover shadow-md"
            />
            <img
              src="/images/peromyscus.png"
              class="aspect-square max-h-60 rounded-full object-cover shadow-md"
            />
          </div>
          <h3 class="text-red-400">Evolution</h3>
          <p>
            What is the phylogenetic history of these viruses? A comparison of bat and virus
            phylogenies reveals similar branching patterns, suggesting a long-standing association
            that spans millions of years. This relationship highlights the intricate evolutionary
            dynamics between hosts and their viruses.
          </p>
          <div class="flex flex-row items-center justify-center">
            <img class="rounded-md" src="/images/pmv_co_phylogeny.jpg" />
          </div>
          <nav class="flex justify-center pb-4 pt-14 text-center uppercase tracking-wider">
            <a
              class="inline-flex flex-1 justify-center border-none"
              href="https://pubmed.ncbi.nlm.nih.gov/34668771/"
              ><p>Link to paper</p></a
            >
          </nav>
        </div>
      </div>
      <div class="col-span-12 mb-10 h-1 bg-slate-300"></div>
      <h2>Early evolution and spread of SARS-CoV-2</h2>
      <div class="container mx-auto max-w-screen-sm">
        <div class="items-left flex flex-col justify-start text-left">
          <h3 class="text-red-400">SARS-CoV-2 Pandemic</h3>
          <p>
            During the initial stages of the SARS-CoV-2 pandemic, I helped sequence viral genomes
            and analyzed phylogenetic patterns of early introductions and spread across various
            geographic regions.
          </p>
          <h3 class="text-red-400">SARS-CoV-2 in Arizona</h3>
          <p class="">
            <a href="https://pubmed.ncbi.nlm.nih.gov/32887735/" class=""
              >In a collaboration with scientists across Arizona (UA, ASU, NAU, TGen)</a
            >, we sequenced many of the earliest COVID-19 cases identified in March 2020. Our
            analysis focused on determining the number of distinct introductions during this period.
          </p>
          <div class="flex flex-row items-center justify-center">
            <img src="/images/mbio_phylogeny.jpg" class="home-image" />
          </div>
          <h3 class="text-red-400">Phylogenetic Patterns of Spread</h3>
          <p class="">
            I also contributed to a
            <a href="https://pubmed.ncbi.nlm.nih.gov/32912998/" class=""
              >study published in Science</a
            >
            that investigated various phylogenetic hypotheses regarding the initial introductions
            into the United States and Europe.
          </p>
          <div class="flex items-center justify-center">
            <img class="home-image" src="/images/370_564_f1.jpeg" />
          </div>
          <h3 class="text-red-400">Alpha Variant</h3>
          <p class="">
            By examining publicly released sequences on GISAID,
            <a
              href="https://virological.org/t/phylogenetic-evidence-that-b-1-1-7-has-been-circulating-in-the-united-states-since-early-to-mid-november/598"
              class=""
              >we were able to estimate</a
            >
            when the alpha variant, B.1.1.7, entered the United States.
          </p>
          <div class="flex items-center justify-center">
            <img src="/images/b1117.png" class="home-image" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <br class="" />
</template>

<script setup>
import phylogeneticTreeRadial from '/components/graphs/phylogeneticTreeRadial.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const observer = ref(null);

const initObserver = () => {
  const options = {
    root: null,
    threshold: 0.5,
    rootMargin: '0px',
  };

  observer.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('element-visible');
        entry.target.classList.remove('element-hidden');
      }
    });
  }, options);

  // Select elements and start observing them
  const elements = document.querySelectorAll('.element-hidden');
  elements.forEach((element) => observer.value.observe(element));
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

a {
  text-decoration: none;
  border: none;
}
</style>
