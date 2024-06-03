<template>
    <div class="prose dark:prose-invert dark:prose-dark">
        <h1 class="pt-10">About</h1>
        <lines />
        <p>
            I am a postdoctoral fellow at the
            <a class="" href="https://www.fredhutch.org/en.html">Fred Hutch Cancer Center</a> in Seattle,
            Washington, where I study the evolution of Nipah virus in the
            <a class="" href="https://research.fredhutch.org/bloom/en.html">Bloom lab</a>. My research
            primarily focuses on understanding how viruses evolve in bat and rodent reservoirs. This
            includes studying the genetic diversity of novel viruses, and how they evolve in response to
            selection by the host immune system.
        </p>
        <p>
            I received my PhD from the
            <a class="link" href="https://eeb.arizona.edu">
                Department of Ecology and Evolutionary Biology</a>
            at the University of Arizona in Tucson, Arizona. Under the guidance of my PhD advisor, Dr.
            Michael Worobey, I investigated the evolution of paramyxoviruses in wild mammals and the
            spread of SARS-CoV-2 during the early stages of the pandemic.
        </p>
        <p>
            Before pursuing my PhD, I worked as a research technician in
            <a class="link" href="https://mullinslab.microbiol.washington.edu/people/faculty/1460-James-Mullins">Dr.
                James Mullins'</a>
            lab at the University of Washington. During this time, I contributed to projects involving the
            sequencing of HIV genomes from breakthrough infections in vaccine trials and early infection.
        </p>
        <div class="my-10">
            <div class="not-prose flex flex-row justify-evenly font-semibold items-center">
                <div class="flex flex-col items-center gap-2">
                    <VirusIcon class="w-12 h-12" />
                    <p class="text-center">Virus Evolution</p>
                </div>
                <div class="flex flex-col items-center gap-2 ">
                    <MammalIcon class="w-12 h-12" />
                    <p class="text-center">Mammal Biodiversity</p>
                </div>
                <div class="flex flex-col items-center gap-2">
                    <HostVirusIcon class="w-12 h-12" />
                    <p class="text-center">Host/Virus Coevolution</p>
                </div>
                <div class="flex flex-col items-center gap-2">
                    <PhylogeneticsIcon class="w-12 h-12" />
                    <p class="text-center">Phylogenetics</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import lines from '/components/graphs/linesAnimationRedBlue.vue';
import VirusIcon from './icons/Virus.vue';
import PhylogeneticsIcon from './icons/PhylogeneticsIcon.vue';
import MammalIcon from './icons/MammalIcon.vue';
import HostVirusIcon from './icons/HostVirusIcon.vue';
</script>
