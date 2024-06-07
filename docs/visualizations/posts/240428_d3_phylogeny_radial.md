---
title: Radial Phylogeny
date: 2024-04-28
keywords:
  - D3
subtext: Testing making a Nipah Phylogeny
thumbnail: /thumbnails/d3_phylogeny_radial.png
---

<script setup>
import RadialPhylogeny from '/components/graphs/RadialPhylogeny.vue';
</script>

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
  <RadialPhylogeny />
</D3PlotContainer>