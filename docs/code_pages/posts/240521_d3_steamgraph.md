---
layout: page
title: Steamgraph
aside: false
date: 2024-05-21
keywords:
    - D3
subtext: Make an animated steamgraph in D3 with color selections
thumbnail: /thumbnails/steamgraph.png
---

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<select class="form-select" v-model="colorValue">
    <option v-for="color in colorOptions">{{ color }}</option>
  </select>
  <div class="py-4"></div>
  <div ref="svgContainer" class=""></div></D3PlotContainer>


<script setup>
  import * as d3 from 'd3';
  import { onMounted, ref, watch } from 'vue';

  const svgContainer = ref(null);
  const colorValue = ref('interpolateBlues');

  const colorOptions = ['interpolateBlues', 'interpolateViridis', 'interpolateMagma', 'interpolateYlOrRd', 'interpolateSpectral'];

  const n = 20;
  const m = 500;
  const k = 10;
  const width = 928;
  const height = 150;

  let svg;
  let area;
  let stack;
  let y;
  let z;

  function createSvg() {
    svg = d3.select(svgContainer.value).append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr('viewBox', [0, 0, width, height]);
  }

  function bumps(m, k) {
    // Inspired by Lee Byron's test data generator.
    function bump(a, n) {
      const x = 1 / (0.1 + Math.random());
      const y = 2 * Math.random() - 0.5;
      const z = 10 / (0.1 + Math.random());
      for (let i = 0; i < n; ++i) {
        const w = (i / n - y) * z;
        a[i] += x * Math.exp(-w * w);
      }
    }

    const a = [];
    for (let i = 0; i < m; ++i) a[i] = 0;
    for (let i = 0; i < k; ++i) bump(a, m);
    return a;
  }

  function randomize(stack, y, bumps) {
    const layers = stack(d3.transpose(Array.from({ length: n }, () => bumps(m, k))));
    y.domain([
      d3.min(layers, l => d3.min(l, d => d[0])),
      d3.max(layers, l => d3.max(l, d => d[1]))
    ]);
    return layers;
  }

  function updateChart() {
    const transition = svg.transition()
      .duration(1000)
      .ease(d3.easeLinear);

    const path = svg.selectAll("path")
      .data(randomize(stack, y, bumps));

    path.enter().append("path")
      .merge(path)
      .transition(transition)
      .attr("fill", (d, i) => z(i / n))
      .attr("d", area);

    path.exit().remove();

    setTimeout(() => {
      updateChart();
    }, 2000);
  }

  function initChart() {
    const x = d3.scaleLinear([0, m - 1], [0, width]);
    y = d3.scaleLinear([0, 1], [height, 0]);

    area = d3.area()
      .x((d, i) => x(i))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]));

    stack = d3.stack()
      .keys(d3.range(n))
      .offset(d3.stackOffsetWiggle)
      .order(d3.stackOrderNone);

    z = d3[colorValue.value];
  }

  onMounted(() => {
    createSvg();
    initChart();
    updateChart();
  });

  watch(colorValue, (newValue) => {
    z = d3[newValue];
  });
</script>

