---
layout: doc
title: D3 zoom and animations onto plasmids
aside: false
date: 2024-05-17
keywords:
  - D3
subtext: Testing different zoom animations on a mutant plasmid library
thumbnail: /thumbnails/plasmidZoom.jpg
---

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<svg></svg>
</D3PlotContainer>

<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';


onMounted(() => {
  const width = 500;
  const height = 500;

  const svg = d3.select('svg')
    .attr('preserveAspectRatio', "xMinYMin meet")
    .attr("viewBox", [0, 0, width, height]);

  const g = svg.append("g");

  const arcData = [];

  function generateArcs(numArcs) {
    const rows = Math.floor(Math.sqrt(numArcs));
    const cols = Math.ceil(numArcs / rows);
    const xSpacing = width / (cols + 1);
    const ySpacing = height / (rows + 1);
    const aminoAcids = ['A', 'R', 'N', 'D', 'C', 'Q', 'E', 'G', 'H', 'I', 'L', 'K', 'M', 'F', 'P', 'S', 'T', 'W', 'Y', 'V'];

    let count = 0;
    for (let i = 1; i <= rows; i++) {
      for (let j = 1; j <= cols; j++) {
        if (count >= numArcs) break;

        const x = j * xSpacing;
        const y = i * ySpacing;

        g.append("path")
          .attr("transform", `translate(${x},${y})`)
          .attr("fill", "currentColor")
          .attr("d", d3.arc()({
            innerRadius: 10,
            outerRadius: 7,
            startAngle: -Math.PI,
            endAngle: Math.PI
          }));

        const randomColor = d3.interpolateSpectral(d3.randomUniform()(0, 1));
        const arcGroup = g.append("g")
          .attr("transform", `translate(${x},${y})`);

        arcGroup.append("path")
          .attr("fill", randomColor)
          .attr("d", d3.arc()({
            innerRadius: 11,
            outerRadius: 6,
            startAngle: -Math.PI / 3,
            endAngle: Math.PI / 3
          }));

        // Generate random text
        const randomNumber = Math.floor(Math.random() * 476) + 25;
        const randomAminoAcid1 = aminoAcids[Math.floor(Math.random() * aminoAcids.length)];
        let randomAminoAcid2 = aminoAcids[Math.floor(Math.random() * aminoAcids.length)];
        while (randomAminoAcid2 === randomAminoAcid1) {
          randomAminoAcid2 = aminoAcids[Math.floor(Math.random() * aminoAcids.length)];
        }
        const randomText = `${randomAminoAcid1}${randomNumber}${randomAminoAcid2}`;

        // Append the random text
        arcGroup.append("text")
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "central")
          .attr("font-size", "4px")
          .attr("fill", "currentColor")
          .text(randomText);

        arcData.push([x, y, 30]);

        count++;
      }
    }
  }

  generateArcs(400);

  let currentTransform = [width / 2, height / 2, height];

  function transition() {
    const d = arcData[Math.floor(Math.random() * arcData.length)];
    const i = d3.interpolateZoom(currentTransform, [...d, d[2] * 10 + 1]);

    g.transition()
      .delay(250)
      .duration(i.duration)
      .attrTween("transform", () => t => transform(currentTransform = i(t)))
      .on("end", () => {
        // Zoom back out to the initial view
        const initialView = [width / 2, height / 2, height];
        const j = d3.interpolateZoom(currentTransform, initialView);

        g.transition()
          .delay(1000) // Delay before zooming back out
          .duration(j.duration)
          .attrTween("transform", () => t => transform(currentTransform = j(t)))
          .on("end", () => {
            // Pause for two seconds before zooming into the next arc
            setTimeout(transition, 2000);
          });
      });
  }

  function transform([x, y, r]) {
    return `
      translate(${width / 2}, ${height / 2})
      scale(${height / r })
      translate(${-x}, ${-y})
    `;
  }

  transition();
});
</script>
