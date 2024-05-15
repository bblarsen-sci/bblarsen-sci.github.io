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
import FigureHeader from "/components/layouts/FigureHeader.vue"
import HeatmapTenBlocks from "/components/graphs/HeatmapTenBlocks.vue";
import HeatmapTenBlocksTest from "/components/graphs/HeatmapTenBlocksTest.vue";
</script>

<FigureHeader title="Heatmap of mutational effects in blocks of sites with a transition animation on repeat"/>
<HeatmapTenBlocksTest />