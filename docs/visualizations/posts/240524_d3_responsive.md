---
title: Responsive breakpoints
date: 2024-05-24
keywords:
  - D3
subtext: Test using vue dimension watchers rather than viewbox to responsively adjust plot size
thumbnail: /thumbnails/responsive.png
---

<script setup>
  import ResponsiveBreakpoints from '/components/graphs/ResponsiveBreakpoints.vue';
</script>

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<ResponsiveBreakpoints />
</D3PlotContainer>


<div class='py-24 prose dark:prose-dark dark:prose-invert prose-sm text-xs'>

# Code

<<< @/components/graphs/ResponsiveBreakpoints.vue

</div>
