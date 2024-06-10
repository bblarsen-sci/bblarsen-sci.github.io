---
title: Circle Color Spread
date: 2024-06-08
keywords:
  - D3
subtext: Testing simulation where colors randomly appear and spread
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


<div class='py-24 prose dark:prose-dark dark:prose-invert prose-sm text-xs'>

# Code

<<< @/components/graphs/ColorSpread.vue

</div>