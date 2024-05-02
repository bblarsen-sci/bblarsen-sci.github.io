---
title: D3 Heatmap
aside: false
date: 2024-05-01
keywords:
    - D3
    - Heatmap
subtext: How to make a heatmap from deep mutational scanning data using D3, adding some interactivity. This heatmap shows the effect of receptor binding protein mutations on cell entry in CHO-bEFNB2 cells. The 'X' represents the unmutated amino acid.
---

# {{$frontmatter.title}}
{{$frontmatter.subtext}}

<script setup>
import HeatmapTenBlocks from "/components/graphs/HeatmapTenBlocks.vue";
</script>

<HeatmapTenBlocks />