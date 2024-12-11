---
title: Antibody escape line plot animation
date: 2024-06-06
keywords:
  - D3
subtext: Animate between the different antibodies with transition
thumbnail: /thumbnails/animatedEscapeLines.png
---

<script setup>
  import AntibodyEscapeLinesAnimation from '/components/graphs/AntibodyEscapeLinesAnimation.vue';
</script>

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<AntibodyEscapeLinesAnimation />
</D3PlotContainer>


<div class='code-below-figure'>

# Code

<<< @/components/graphs/AntibodyEscapeLinesAnimation.vue

</div>