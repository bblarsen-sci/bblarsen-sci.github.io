---
layout: doc
title: Heatmap wrapped in rows
aside: false
date: 2024-05-03
keywords:
  - D3
subtext: Heatmap of deep mutational scanning data that is wrapped in multiple rows and allows customization.
thumbnail: /thumbnails/d3_heatmap_wrapped.png
---

<script setup>
import HeatmapWrapped from '/components/graphs/HeatmapWrapped.vue';
</script>

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<HeatmapWrapped />
