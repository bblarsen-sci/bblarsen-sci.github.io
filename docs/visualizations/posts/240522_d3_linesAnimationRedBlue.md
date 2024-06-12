---
title: Animated lines
date: 2024-05-22
keywords:
  - D3
subtext: Moving red/blue lines with gradient applied on y-axis
thumbnail: /thumbnails/d3_lines_redblue.png
---

<script setup>
  import LinesAnimationRedBlue from '/components/graphs/linesAnimationRedBlue.vue';
</script>

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<LinesAnimationRedBlue/>
</D3PlotContainer>

<div class='code-below-figure'>

# Code

<<< @/components/graphs/linesAnimationRedBlue.vue

</div>