---
title: Gradient with vue code style
date: 2024-06-09
keywords:
  - D3
subtext: Make some gradients with Vue
thumbnail: /thumbnails/gradientStripesToggle.png
---

<script setup>
  import GradientStripeswVue from '/components/graphs/GradientStripes_wVue.vue';
</script>

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<GradientStripeswVue/>
</D3PlotContainer>


<div class='py-24 prose dark:prose-dark dark:prose-invert prose-sm text-xs'>

# Code

<<< @/components/graphs/GradientStripes_wVue.vue

</div>