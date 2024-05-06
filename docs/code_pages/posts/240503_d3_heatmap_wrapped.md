---
title: D3 heatmap wrapped
aside: false
date: 2024-05-03
keywords:
    - D3
subtext: Heatmap of deep mutational scanning data that is wrapped into multiple rows
---
# {{$frontmatter.title}}
{{$frontmatter.subtext}}


## Heatmap of Mutational Effects on Cell Entry
I wanted to figure out how to make wrapped heatmaps with D3 showing deep mutational scanning data. Here is my attempt. There are a few dropdown menus below the heatmap to change the appearance of the heatmap, as well as to save an svg. 


<script setup>
import HeatmapWrapped from "/components/graphs/HeatmapWrapped.vue";
</script>

<HeatmapWrapped />