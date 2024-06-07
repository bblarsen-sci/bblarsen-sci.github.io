---
title: Simple Scatterplot
date: 2024-06-07
keywords:
  - D3
subtext: Comparing effects of mutations
thumbnail: /thumbnails/scatterplot.png
---

<script setup>
  import XYScatterPlot from '/components/graphs/XYScatterPlot.vue';
</script>

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<XYScatterPlot/>
</D3PlotContainer>


<div class='py-24 prose dark:prose-dark dark:prose-invert prose-sm text-xs'>

# Code

<<< @/components/graphs/XYScatterPlot.vue

</div>