---
title: Lines animation
date: 2024-05-19
keywords:
  - D3
subtext: Animation of points with random y-coordinates with fitted line
thumbnail: /thumbnails/lines_animation.png
---

<script setup>
  import FittedLineAnimation from '/components/graphs/FittedLineAnimation.vue';
</script>

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<FittedLineAnimation/>
</D3PlotContainer>

<div class='code-below-figure'>

# Code


<<< @/components/graphs/FittedLineAnimation.vue

</div>