---
title: Test different code style
date: 2024-05-27
keywords:
  - D3
subtext: Make a basic plot but put syntax logic in vue instead of D3
thumbnail: /thumbnails/data_wrangling.png
---

<script setup>
  import DataWrangling from '/components/graphs/DataWranglingCodeStyle.vue';
</script>

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<DataWrangling/>
</D3PlotContainer>


<div class='code-below-figure'>

# Code

<<< @/components/graphs/DataWranglingCodeStyle.vue

</div>
