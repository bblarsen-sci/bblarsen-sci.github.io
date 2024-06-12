---
title: Heatmap blocks binding animation
date: 2024-06-12
keywords:
  - D3
subtext: Make an animated heatmap
---

<script setup>
  import HeatmapBlocksBinding from '/components/graphs/HeatmapBlocksBinding.vue';
</script>

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer class="flex flex-col items-center">
<HeatmapBlocksBinding/>
</D3PlotContainer>

