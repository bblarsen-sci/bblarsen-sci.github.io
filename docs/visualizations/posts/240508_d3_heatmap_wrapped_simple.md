---
layout: doc
title: Zoomable heatmap
aside: false
date: 2024-05-08
keywords:
  - D3
subtext: Demonstration of using D3 zoom function to make heatmap zoomable and draggable inside container. Scales with screen size.
thumbnail: /thumbnails/d3_zoom_heatmap.png
---

<script setup>
  import HeatmapWrappedSimple from '/components/graphs/HeatmapWrappedSimple.vue';
</script>

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<HeatmapWrappedSimple />
</D3PlotContainer>
