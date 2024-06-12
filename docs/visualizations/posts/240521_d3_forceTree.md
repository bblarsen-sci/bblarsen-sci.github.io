---
title: Force phylogenetic tree
date: 2024-05-21
keywords:
  - D3
subtext: Nipah force phylogenetic tree that is draggable
thumbnail: /thumbnails/d3_forceTree.png
---

<script setup>
  import ForcePhyloTree from '/components/graphs/ForcePhyloTree.vue';
</script>

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<ForcePhyloTree/>
</D3PlotContainer>

<div class='code-below-figure'>

# Code

Code based on example from <a href="https://observablehq.com/@d3/force-directed-tree?intent=fork">D3 Gallery</a> by Mike Bostock.

<<< @/components/graphs/ForcePhyloTree.vue

</div>