---
title: Gradient Stripes
date: 2024-05-28
keywords:
  - D3
subtext: Map mean DMS data to a diverging color scale using D3.
thumbnail: /thumbnails/gradientStripes.png
---

<script setup>
  import GradientStripes from '/components/graphs/GradientStripes.vue';
</script>

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<GradientStripes/>
</D3PlotContainer>


<div class='code-below-figure'>

# Code

<<< @/components/graphs/GradientStripes.vue

</div>


