---
title: Neutralization curve no animation
date: 2024-05-27
keywords:
  - D3
subtext: Make a static neut curve plotted with D3
thumbnail: /thumbnails/d3_neutCurve_static.png
---

<script setup>
  import NeutCurveNoAnimation from '/components/graphs/NeutCurveNoAnimation.vue'
</script>

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<NeutCurveNoAnimation/>
</D3PlotContainer>

<div class='py-24 prose dark:prose-dark dark:prose-invert prose-sm text-xs'>

# Code

<<< @/components/graphs/NeutCurveNoAnimation.vue

</div>
