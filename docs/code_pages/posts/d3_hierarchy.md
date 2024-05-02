---
title: D3 Hierarchy
aside: false
date: 2024-04-30
keywords:
    - D3
    - Hierarchy
subtext: How to convert a .csv into a D3 hierarchy
---
# {{$frontmatter.title}}
{{$frontmatter.subtext}}

I wanted to figure out how to make a hierarchy using D3. Converting a flat ```.csv``` file into a format that ```D3``` wants turned out to be tricky, but was solved with the ```d3.group``` function. The hierarchy format will allow additional visualizations in the future. Here is a sample, showing three amino acid sites (71, 72, 73), with the mutants and their effects nested in each one. 

<script setup>
import Hierarchy from "/components/graphs/Hierarchy.vue";
</script>


<Hierarchy />


