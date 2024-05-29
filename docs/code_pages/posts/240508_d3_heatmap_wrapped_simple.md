---
layout: page
title: Zoomable D3 Heatmap
aside: false
date: 2024-05-08
keywords:
    - D3
subtext: Demonstration of using D3 zoom function to make heatmap zoomable and draggable inside container. Scales with screen size.
thumbnail: /code_pages/thumbnails/d3_zoom_heatmap.png
---

<script setup>
import HeatmapWrappedSimple from "/components/graphs/heatmapWrappedSimple.vue";
</script>

<FigureTitle title="Zoomable and draggable heatmap"/>
<D3PlotContainer>
<HeatmapWrappedSimple />
</D3PlotContainer>
