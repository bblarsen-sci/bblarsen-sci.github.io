<template>
    <div
        class="h-[600px] mx-auto flex flex-col justify-center items-center align-middle text-center prose dark:prose-dark dark:prose-invert">
        <h1 class="prose-2xl">Brendan Larsen</h1>
        <h1 class="bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-sky-700 via-slate-300">Viral Evolution
            and Diversity</h1>
        <div class="text-sm flex flex-row gap-6 uppercase tracking-wider">
            <div class="flex flex-col gap-1 items-center ">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info"
                    viewBox="0 0 16 16">
                    <path
                        d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                </svg>
                <a class="not-prose inline-flex flex-1 justify-center dark:text-slate-300 text-slate-600 hover:text-red-600"
                    href="/about">About</a>
            </div>
            <div class="flex flex-col gap-1 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-book"
                    viewBox="0 0 16 16">
                    <path
                        d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                </svg>
                <a class="not-prose inline-flex flex-1 justify-center dark:text-slate-300 text-slate-600 hover:text-red-600"
                    href="/publications">Pubs</a>
            </div>
            <div class="flex flex-col gap-1 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-bar-chart-line" viewBox="0 0 16 16">
                    <path
                        d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z" />
                </svg>
                <a class="not-prose inline-flex flex-1 justify-center dark:text-slate-300 text-slate-600 hover:text-red-600"
                    href="/code_pages/code_index">Visuals</a>
            </div>
        </div>
    </div>
    <div class="container mx-auto">
        <div class="flex items-center gap-2 justify-between pb-4 text-sm tracking-wider uppercase text-center">
            <a class="inline-flex flex-1 justify-center text-slate-600 dark:text-slate-300 hover:text-red-600"
                href="#section-1">Current Projects</a>
            <a class="inline-flex flex-1 justify-center text-slate-600 dark:text-slate-300 hover:text-red-600"
                href="#section-2">Past Projects</a>
        </div>
        <div class="p-4 sm:rounded-lg bg-sky-dark bg-no-repeat prose dark:prose-dark dark:prose-invert text-white">
            <div class="col-start-1 col-span-12 lg:col-span-10">
                <h1 class="text-white">Current Projects</h1>
                <h2 id="section-1" class="-mt-6 text-slate-300">Deep Mutational Scanning of
                    the Nipah Receptor Binding Protein</h2>
            </div>
            <div class="container mx-auto max-w-screen-sm">
                <div class="relative items-left text-left justify-between">
                    <h2 class=" text-sky-400">Nipah Virus</h2>
                    <p class="-mt-4">Nipah is a bat-borne virus that occasionally spills over into human populations,
                        causing severe disease with high fatality rates. Currently, there are no approved vaccines or
                        therapeutics available for the prevention or treatment of Nipah virus infection.</p>
                    <img>
                    <phylogeneticTreeRadial class="" />
                    </img>
                    <figcaption class='text-center text-slate-300'>Phylogenetic tree of Nipah viruses</figcaption>
                    <h2 class=" text-sky-400">Receptor Binding Protein</h2>
                    <p class="-mt-4"> Nipah virus expresses two surface proteins: the receptor binding protein and the
                        fusion protein. The receptor binding protein can bind two different host receptors, ephrin-B2
                        and ephrin-B3, with high affinity. Once bound, the receptor binding protein undergoes a
                        conformational change, which triggers the fusion protein to merge the viral and cell membranes,
                        leading to viral entry into host cells. To better understand these processes, I performed deep
                        mutational scanning on the receptor binding protein and measured the effects of all mutations on
                        cell entry, receptor binding, and antibody escape using a BSL-2 pseudovirus platform.</p>
                    <div class="flex flex-row justify-center items-center text-center py-0">
                        <img src="/images/entry_tetramer_better.png" class="max-w-96 element-hidden">
                    </div>
                    <figcaption class="text-slate-300 text-center">Structure of the tetrameric receptor binding
                        protein
                        colored by
                        the mean effect of mutations on cell entry. Darker red indicates sites with low tolerance
                        for mutations.</figcaption>
                    <h2 class=" text-sky-400">Antibody Escape</h2>
                    <p class="-mt-4">The receptor binding protein is also an important target for neutralizing
                        antibodies, which have shown effectiveness in preventing disease in animal models. To better
                        understand constraint across different epitopes, we prospectively mapped sites of escape for
                        six
                        antibodies. </p>
                    <div class="flex flex-row justify-center items-center text-center gap-4">
                        <img src="/images/antibody_escape-01.jpg" class="max-h-80 bg-white rounded-lg">
                        <figcaption class="text-slate-300"> Sites of antibody escape.</figcaption>
                    </div>
                    <p
                        class="text-center tracking-tight py-10 text-2xl bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-sky-400 font-semibold">
                        These data aid in the development of vaccines and antibody therapies, in addition to
                        improving
                        basic understanding of the function of the receptor binding protein.</p>
                    <div class="flex items-center justify-between pb-4 tracking-wider uppercase text-center">
                        <a class="not-prose inline-flex flex-1 justify-center text-slate-300 dark:text-slate-300 hover:text-red-600"
                            href="https://dms-vep.org/Nipah_Malaysia_RBP_DMS/">Link to project website</a>
                        <a class="not-prose inline-flex flex-1 justify-center text-slate-300 dark:text-slate-300 hover:text-red-600"
                            href="https://www.biorxiv.org/content/10.1101/2024.04.17.589977v1">Link to preprint</a>
                    </div>
                </div>
            </div>
        </div>
        <br></br>
        <div class="p-4 sm:rounded-lg bg-red bg-no-repeat prose dark:prose-dark dark:prose-invert text-white">
            <div class="col-start-1 col-span-12 lg:col-span-10">
                <h1 class="text-white">Past Projects</h1>
                <h2 id="section-2" class="-mt-6 text-slate-300">Evolution and Diversity of
                    Paramyxoviruses in Bats and Rodents</h2>
            </div>
            <div class="container mx-auto max-w-screen-sm">
                <div class="relative items-left text-left justify-between">
                    <h2 class=" text-red-400 ">Paramyxoviruses</h2>
                    <p class="-mt-4">Paramyxoviruses are widespread and extremely diverse, including notable human
                        pathogens such as Nipah and measles viruses. To better understand viral diversity across host
                        species, I captured hundreds of individual animals from 19 bat and 15 rodent species across
                        Arizona. From feces and urine samples collected from these animals, I identified 55 new viral
                        sequences, including some nearly full-length genomes.</p>
                    <div class="flex flex-wrap justify-evenly items-center align-middle">
                        <img src="/images/pallid.jpg"
                            class="shadow-md aspect-square object-cover max-h-60 rounded-full">
                        <img src="/images/peromyscus.png"
                            class="shadow-md aspect-square object-cover max-h-60  rounded-full">
                    </div>
                    <h2 class=" text-red-400">Evolution</h2>
                    <p class="-mt-4">What is the phylogenetic history of these viruses? A comparison of bat and virus
                        phylogenies reveals similar branching patterns, suggesting a long-standing association
                        that
                        spans millions of years. This relationship highlights the intricate evolutionary
                        dynamics
                        between hosts and their viruses.</p>
                    <div class="flex flex-row items-center justify-center">
                        <img class="rounded-md" src="/images/pmv_co_phylogeny.jpg"></img>
                    </div>
                    <nav class="flex justify-center text-center pt-14 pb-4 tracking-wider uppercase">
                        <a class="not-prose inline-flex flex-1 justify-center text-slate-300 dark:text-slate-300 hover:text-red-600"
                            href="https://pubmed.ncbi.nlm.nih.gov/34668771/">Link to
                            paper</a>
                    </nav>
                </div>
            </div>
            <div class="h-1 col-span-12 bg-slate-300"></div>
            <h2 class="text-slate-300">Early evolution and spread of SARS-CoV-2</h2>
            <div class="container mx-auto max-w-screen-sm">
                <div class="flex flex-col items-left text-left justify-start">
                    <h2 class=" text-red-400">SARS-CoV-2 Pandemic</h2>
                    <p class="-mt-4"> During the initial stages of the SARS-CoV-2
                        pandemic, I helped sequence viral genomes and analyzed phylogenetic patterns of early
                        introductions and spread across various geographic regions.</p>
                    <h2 class=" text-red-400 ">SARS-CoV-2 in Arizona</h2>
                    <p class='-mt-4'> <a href="https://pubmed.ncbi.nlm.nih.gov/32887735/"
                            class="hover:text-red-600 underline not-prose">In a collaboration with scientists
                            across
                            Arizona (UA, ASU, NAU, TGen)</a>, we sequenced many of the earliest COVID-19 cases
                        identified in March 2020. Our analysis focused on determining the number of distinct
                        introductions during this period.</p>
                    <div class="flex flex-row items-center justify-center">
                        <img src="/images/mbio_phylogeny.jpg"
                            class="max-w-80 aspect-square object-cover rounded-lg"></img>
                    </div>
                    <h2 class=" text-red-400 ">Phylogenetic Patterns of Spread</h2>
                    <p class="-mt-4">I also contributed to a <a href="https://pubmed.ncbi.nlm.nih.gov/32912998/"
                            class="hover:text-red-600 underline not-prose">study published in Science</a> that
                        investigated
                        various phylogenetic hypotheses regarding the initial introductions into the United States
                        and
                        Europe.</p>
                    <div class="flex items-center justify-center">
                        <img class="max-w-80 aspect-square object-cover rounded-lg" src="/images/370_564_f1.jpeg"></img>
                    </div>
                    <h2 class=" text-red-400">Alpha Variant</h2>
                    <p class="-mt-4">By examining publicly released sequences on GISAID, <a
                            href="https://virological.org/t/phylogenetic-evidence-that-b-1-1-7-has-been-circulating-in-the-united-states-since-early-to-mid-november/598"
                            class="hover:text-red-600 underline not-prose">we were able to estimate</a> when the alpha
                        variant,
                        B.1.1.7, entered the United States.</p>
                    <div class="flex items-center justify-center">
                        <img src="/images/b1117.png" class="max-w-full max-h-96 rounded-lg"></img>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <br class=""></br>
</template>

<script setup>
import phylogeneticTreeRadial from "/components/graphs/phylogeneticTreeRadial.vue";
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

a {
    text-decoration: none;
    border: none;
}
</style>
