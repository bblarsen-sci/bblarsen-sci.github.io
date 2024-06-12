---
title: Heatmap windows + animation
date: 2024-05-01
keywords:
  - D3
subtext: Heatmap showing effects of mutations in blocks of sites with a transistion animation on repeat.
thumbnail: /thumbnails/d3_heatmap_blocks.png
---

<script setup>
import HeatmapBlocks from '/components/graphs/HeatmapBlocks.vue';
</script>

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer class="flex flex-col items-center">
<HeatmapBlocks />
</D3PlotContainer>

<div class='code-below-figure'>

# Code

<<< @/components/graphs/HeatmapBlocks.vue

</div>