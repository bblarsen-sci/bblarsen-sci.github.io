---
title: Virus Animation
date: 2024-06-08
keywords:
  - D3
subtext: Make a simple virus moving animation 
thumbnail: /thumbnails/virusAnimation.png
---

<script setup>
  import VirusAnimation from '/components/graphs/VirusAnimation.vue';
</script>

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<VirusAnimation/>
</D3PlotContainer>


<div class='code-below-figure'>

# Code

<<< @/components/graphs/VirusAnimation.vue

</div>