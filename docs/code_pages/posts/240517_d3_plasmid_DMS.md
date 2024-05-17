---
layout: page
title: D3 zoom and shape animations
aside: false
date: 2024-05-17
keywords:
    - D3
subtext: Testing different animations and shape movement transistions
---


<script setup>
import plasmidZoom from "/components/graphs/randomPlasmidZoom.vue";
import lentivirusGenome from "/components/graphs/lentivirusGenome.vue"
</script>

<FigureTitle title="Overview of Lentivirus Genome used for Pseudotyping"/>
<D3PlotContainer>
<lentivirusGenome/>
</D3PlotContainer>

<br></br>
<FigureTitle title="By building a plasmid library of all possible RBP mutations, we can measure the effects of each one individually in a lentivirus pseudotyping system"/>
<D3PlotContainer>
<plasmidZoom/>
</D3PlotContainer>
