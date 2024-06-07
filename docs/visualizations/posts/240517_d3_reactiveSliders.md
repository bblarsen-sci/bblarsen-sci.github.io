---
title: Vue/D3 Slider Test
date: 2024-05-17
keywords:
  - D3
subtext: Connecting sliders to values to manipulate objects reactively
thumbnail: /thumbnails/slider_test.png
---

<script setup>
  import ReactiveSliders from '/components/graphs/ReactiveSliders.vue';
</script>

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<ReactiveSliders/>
</D3PlotContainer>

