---
title: Steamgraph
date: 2024-05-21
keywords:
  - D3
subtext: Make an animated steamgraph with color selections
thumbnail: /thumbnails/steamgraph.png
---

<script setup>
  import SteamGraph from '/components/graphs/SteamGraph.vue';
</script>

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer >
<SteamGraph/>
</D3PlotContainer>


