---
title: Heatmap in vue style
date: 2024-06-11
keywords:
  - D3
subtext: Make a heatmap with logic in vue style

---

<script setup>
  import HeatmapSimple from '/components/graphs/HeatmapWrappedSimpleVue.vue';
</script>

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<HeatmapSimple/>
</D3PlotContainer>


<div class='py-24 prose dark:prose-dark dark:prose-invert prose-sm text-xs'>

# Code

<<< @/components/graphs/HeatmapWrappedSimpleVue.vue

</div>