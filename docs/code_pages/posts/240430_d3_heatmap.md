---
title: D3 heatmap
aside: false
date: 2024-04-30
keywords:
    - D3
    - Heatmap
subtext: How to make a heatmap from deep mutational scanning data using D3, adding some interactivity. This heatmap shows the effect of receptor binding protein mutations on cell entry in CHO-bEFNB2 cells. The 'X' represents the unmutated amino acid.
---

# {{$frontmatter.title}}
{{$frontmatter.subtext}}

<script setup>
import Heatmap from "/components/graphs/Heatmap.vue";
</script>

<Heatmap />

## Making the heatmap
I like the usefullness of heatmaps in Altair, but the code can be pretty complicated, and was always frustrated how 'one-way' the process felt. Sure, you can make it interactive, and apply filters, but its difficult to manipulate the heatmap once you embed it in a browser. I wanted to figure out how to make a heatmap in D3. 


I am going to break this into three steps. First, the html that vue interacts with. Next, the javascript code to get everything formatted correctly, and finally, the d3 code to make the heatmap itself. 

