---
title: D3 heatmap wrapped
aside: false
date: 2024-05-03
keywords:
    - D3
subtext: Heatmap of deep mutational scanning data that is wrapped in multiple rows
---
# {{$frontmatter.title}}
{{$frontmatter.subtext}}


## Heatmap of Mutational Effects on Cell Entry
I wanted to figure out how to make wrapped heatmaps with D3 that visualize deep mutational scanning data. Here is my attempt. There are a few dropdown menus below to change the appearance of the heatmap, such as:
- Padding (white borders around boxes)
- Stroke (black borders around boxes)
- Rows (how many rows will the heatmap be wrapped in)
- Cutoff (The min/max of the color scheme)
- Color

## Load your own data
The default heatmap shows cell entry data for the Nipah receptor binding protein. To visualize your own data, upload a .csv where the following columns are present:
- site
- wildtype
- mutant
- effect

Right now this heatmap only works on functional cell entry data, but maybe I'll figure out how to map escape and/or receptor binding where values below a certain cutoff are masked. 


<script setup>
import HeatmapWrapped from "/components/graphs/HeatmapWrapped.vue";
</script>

<HeatmapWrapped />