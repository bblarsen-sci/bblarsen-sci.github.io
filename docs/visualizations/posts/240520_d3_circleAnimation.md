---
title: Circle animation Test
date: 2024-05-20
keywords:
  - D3
subtext: Playing around with D3 animations and transitions
thumbnail: /thumbnails/circle_animation.png
---

<script setup>
  import CircleAnimation from '/components/graphs/CircleAnimation.vue';
</script>

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<CircleAnimation/>
</D3PlotContainer>

<div class='code-below-figure'>

# Code


<<< @/components/graphs/CircleAnimation.vue

</div>