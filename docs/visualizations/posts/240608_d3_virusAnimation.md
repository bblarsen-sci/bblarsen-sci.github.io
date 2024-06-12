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


<div class='py-60 prose dark:prose-dark dark:prose-invert prose-sm text-xs'>

# Code

<<< @/components/graphs/VirusAnimation.vue

</div>