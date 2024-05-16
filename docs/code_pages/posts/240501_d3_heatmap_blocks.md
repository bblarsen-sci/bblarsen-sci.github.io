---
layout: page
title: D3 heatmap blocks + animation
aside: false
date: 2024-05-01
keywords:
    - D3
subtext: Heatmap showing mutational effects in blocks of sites with a transistion animation on repeat.
---



<script setup>
import heatmapBlocksAnimated from "/components/graphs/heatmapBlocksAnimatedExtended.vue";
</script>

<FigureTitle title="Heatmap of mutational effects in blocks of sites with a transition animation on repeat"/>
<D3PlotContainer>
    <heatmapBlocksAnimated />
</D3PlotContainer>
