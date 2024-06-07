---
layout: doc
title: PhyloTree with taxa names
aside: false
date: 2024-05-19
keywords:
  - D3
subtext: Nipah phylogenetic tree linear layout with taxa names
thumbnail: /thumbnails/phylogenyAnimated.png
---

<script setup>
  import PhyloTreeLinear from '/components/graphs/PhyloTreeLinear.vue';
</script>

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<PhyloTreeLinear/>
</D3PlotContainer>


<div class='py-24 prose dark:prose-dark dark:prose-invert prose-sm text-xs'>

# Code


<<< @/components/graphs/PhyloTreeLinear.vue

</div>
