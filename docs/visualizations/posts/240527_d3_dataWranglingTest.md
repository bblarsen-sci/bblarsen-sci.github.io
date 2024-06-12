---
title: Scatterplot with selectable DMS data
date: 2024-05-28
keywords:
  - D3
subtext: Toggle between four types of DMS data in scatterplot
thumbnail: /thumbnails/data_wrangling.png
---

<script setup>
  import ScatterPlotDropdown from '/components/graphs/ScatterPlotDropdown.vue';
</script>

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
  <ScatterPlotDropdown/>
</D3PlotContainer>

<div class='code-below-figure'>

# Code

<<< @/components/graphs/ScatterPlotDropdown.vue

</div>