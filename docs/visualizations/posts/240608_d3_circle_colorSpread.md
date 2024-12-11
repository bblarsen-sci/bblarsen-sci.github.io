---
title: Gradient interpolation
date: 2024-06-08
keywords:
  - D3
subtext: Testing random data generation and gradient interpolation
thumbnail: /thumbnails/colorSpread.png
---

<script setup>
  import ColorSpread from '/components/graphs/ColorSpread.vue';
</script>

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<ColorSpread/>
</D3PlotContainer>


<div class='code-below-figure'>

# Code

<<< @/components/graphs/ColorSpread.vue

</div>