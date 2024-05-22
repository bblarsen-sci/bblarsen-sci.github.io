<template>
    <div class="">
        <div class="px-0 lg:px-12 xl:px-24">
            <div
                class="flex items-center mx-auto gap-2 justify-between pb-4 text-sm md:text-lg tracking-wider uppercase opacity-70 text-center">
                <a class="inline-flex flex-1 justify-center hover:text-sky-600" href="#section-1">Current Projects</a>
                <a class="inline-flex flex-1 justify-center hover:text-sky-600" href="#section-2">Past Projects</a>
            </div>
            <div class="p-4 lg:p-10 lg:rounded-2xl bg-sky-dark bg-no-repeat text-slate-200">
                <div class="col-start-1 col-span-12 lg:col-span-10 mt-4">
                    <div class="text-4xl 2xl:text-6xl font-extrabold mb-4">Current Projects</div>
                    <div id="section-1" class="tracking-wider uppercase opacity-70 text-xl ">Deep Mutational Scanning of
                        the Nipah Receptor Binding Protein</div>
                </div>
                <div class="container mx-auto max-w-screen-md text-md">
                    <div class="flex flex-col items-left text-left justify-start">
                        <div class="font-semibold text-2xl text-sky-400 pt-16">Nipah Virus</div>
                        <div class="leading-8">Nipah is a bat-borne virus that occasionally spills over into humans,
                            causing
                            devastating disease and high fatality rates. There are currently no approved vaccines or
                            therapeutics.</div>
                        <phylogeneticTreeRadial class="" />
                        <div class="font-light text-center text-sm">Phylogenetic tree of Nipah viruses</div>
                        <div class="pt-10 font-semibold text-2xl text-sky-400">Receptor Binding Protein</div>
                        <div class="leading-8"> Nipah virus expresses two surface proteins: the receptor binding and
                            fusion proteins. The receptor binding protein can bind two different host receptors with
                            high affinity: ephrin-B2 and ephrin-B3. Once bound, the receptor binding protein undergoes a
                            conformational change, which triggers the fusion protein to merge viral and cell membranes,
                            leading to viral entry into host cells. To better understand these processes, I performed
                            deep mutational scanning on the receptor binding protein and measured the effects of all
                            mutations on cell entry, receptor binding, and antibody escape with a BSL-2 pseudovirus
                            platform.</div>
                        <div class="flex flex-row justify-center items-center text-center py-16 gap-2">
                            <img src="/images/entry_tetramer_better.png" class="max-w-96 ">
                        </div>
                        <p class="text-sm font-light text-center opacity-60">Structure of the tetrameric receptor binding protein
                            colored by
                            the mean effect of mutations on cell entry. Darker red indicates sites with low tolerance
                            for mutations.</p>
                        <div class="pt-20 font-semibold text-2xl text-sky-400">Antibody Escape</div>
                        <div class="leading-8">The receptor binding protein is also an important target for neutralizing
                            antibodies, which have shown effectiveness in preventing disease in animal models. To better
                            understand constraint across different epitopes, we prospectively mapped sites of escape for
                            six
                            antibodies. </div>
                        <div class="flex flex-row justify-center items-center text-center py-16 gap-2">
                            <img src="/images/antibody_escape-01.jpg" class="max-h-80 bg-white rounded-lg">
                            <p class=" text-sm font-light"> Sites of antibody escape. </p>
                        </div>
                        <div
                            class="leading-tight text-center py-16 tracking-tight text-2xl lg:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-sky-400 font-semibold">
                            These data aid in the development of vaccines and antibody therapies, in addition to
                            improving
                            basic understanding of the function of the receptor binding protein.</div>
                        <div
                            class="flex items-center mx-auto gap-2 justify-between pb-4 text-sm md:text-lg tracking-wider uppercase opacity-70 text-center">
                            <a class="inline-flex flex-1 justify-center hover:text-sky-500 "
                                href="https://dms-vep.org/Nipah_Malaysia_RBP_DMS/">Link to project website</a>
                            <a class="inline-flex flex-1 justify-center hover:text-sky-500 "
                                href="https://www.biorxiv.org/content/10.1101/2024.04.17.589977v1">Link to preprint</a>
                        </div>
                    </div>
                </div>
            </div>
            <br class=""></br>
            <div class="p-4 lg:p-10 lg:rounded-2xl bg-red bg-no-repeat text-slate-200">
                <div class="col-start-1 col-span-12 lg:col-span-10 mt-4">
                    <div class="text-4xl 2xl:text-6xl font-extrabold mb-4">Past Projects</div>
                    <div id="section-2" class="tracking-wider uppercase opacity-70 text-xl">Evolution and Diversity of
                        Paramyxoviruses in Bats and Rodents</div>
                </div>
                <div class="container mx-auto max-w-screen-md">
                    <div class="flex flex-col items-left text-left justify-start">
                        <div class="font-semibold text-2xl text-red-400 pt-16">Paramyxoviruses</div>
                        <div class="leading-10">Paramyxoviruses are widespread and extremely diverse, including notable
                            human pathogens such as Nipah and Measles. To better understand viral diversity across host
                            species, I captured hundreds of individual animals from 19 bat and 15 rodent species across
                            Arizona. From feces and urine samples collected from these animals, I identified 55 new
                            viral
                            sequences, including some nearly full-length genomes.</div>
                        <div class="flex flex-row justify-center space-x-10 items-center align-middle pt-14 ">
                            <img src="/images/pallid.jpg" class="shadow-md aspect-square object-cover max-h-80">
                            <img src="/images/peromyscus.png" class="shadow-md aspect-square object-cover max-h-80  ">
                        </div>
                        <div class="font-semibold text-2xl text-red-400 pt-16">Evolution</div>
                        <div class="flex items-center justify-center leading-10">
                            <p class="">What is the phylogenetic history of these viruses? A comparison of bat and virus
                                phylogenies reveals similar branching patterns, suggesting a long-standing association
                                that
                                spans millions of years. This relationship highlights the intricate evolutionary
                                dynamics
                                between hosts and their viruses.</p>
                        </div>
                        <div class="flex flex-row items-center justify-center pt-14 ">
                            <img class="" src="/images/pmv_co_phylogeny.jpg"></img>
                        </div>
                        <nav class="flex justify-center text-center pt-14 pb-4 tracking-wider uppercase">
                            <a class=" hover:text-sky-600 " href="https://pubmed.ncbi.nlm.nih.gov/34668771/">Link to
                                paper</a>
                        </nav>
                    </div>
                </div>
                <div class="h-1 col-span-12 bg-slate-400"></div>
                <div class="mt-6">
                    <div class="tracking-wider uppercase opacity-70 text-xl">Early evolution and spread of SARS-CoV-2
                    </div>
                </div>
                <div class="container mx-auto max-w-screen-md">
                    <div class="flex flex-col items-left text-left justify-start">
                        <div class="font-semibold text-2xl text-red-400 pt-16">SARS-CoV-2 Pandemic</div>
                        <p class="items-center justify-center leading-10"> During the initial stages of the SARS-CoV-2
                            pandemic, I helped sequence viral genomes and analyzed phylogenetic patterns of early
                            introductions and spread across various geographic regions.</p>
                        <div class="font-semibold text-2xl text-red-400 pt-16">SARS-CoV-2 in Arizona</div>
                        <p class="leading-8"> <a href="https://pubmed.ncbi.nlm.nih.gov/32887735/"
                                class="hover:text-sky-600 underline leading-10">In a collaboration with scientists
                                across
                                Arizona (UA, ASU, NAU, TGen)</a>, we sequenced many of the earliest COVID-19 cases
                            identified in March 2020. Our analysis focused on determining the number of distinct
                            introductions during this period.</p>
                        <div class="flex flex-row items-center justify-center pt-14">
                            <img src="/images/mbio_phylogeny.jpg" class="max-w-96"></img>
                        </div>
                        <div class="font-semibold text-2xl text-red-400 pt-16">Phylogenetic Patterns of Spread</div>
                        <p class="leading-10">I also contributed to a <a
                                href="https://pubmed.ncbi.nlm.nih.gov/32912998/"
                                class="hover:text-sky-600 underline">study published in Science</a> that investigated
                            various phylogenetic hypotheses regarding the initial introductions into the United States
                            and
                            Europe.</p>
                        <div class="flex items-center justify-center col-span-2 pt-14">
                            <img class="max-w-full max-h-96" src="/images/370_564_f1.jpeg"></img>
                        </div>
                        <div class="font-semibold text-2xl text-red-400 pt-16">Alpha Variant</div>
                        <p class="leading-10">By examining publicly released sequences on GISAID, <a
                                href="https://virological.org/t/phylogenetic-evidence-that-b-1-1-7-has-been-circulating-in-the-united-states-since-early-to-mid-november/598"
                                class="hover:text-sky-500 underline">we were able to estimate</a> when the alpha
                            variant,
                            B.1.1.7, entered the United States.</p>
                        <div class="flex items-center justify-center pt-14">
                            <img src="/images/b1117.png" class="max-w-full max-h-96"></img>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            <br class=""></br>

        </div>
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
</style>