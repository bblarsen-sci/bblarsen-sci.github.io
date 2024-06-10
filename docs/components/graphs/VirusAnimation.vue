<template>
  <simpleTooltip greeting-message="HelloWorld!" />
  <svg id="svgContainer"></svg>
</template>
<script setup>
import { onMounted } from 'vue';
import * as d3 from 'd3';
import simpleTooltip from '/components/simpleTooltip.vue';

onMounted(() => {
  const width = 600;
  const height = 200;

  const svg = d3.select('#svgContainer').attr('viewBox', `0 0 ${width} ${height}`);
  const radius = 10;
  const smallRadius = 3;
  const lineLength = 8;
  const directions = [
    { x: 1, y: 0 },
    { x: Math.sqrt(2) / 2, y: Math.sqrt(2) / 2 },
    { x: 0, y: 1 },
    { x: -Math.sqrt(2) / 2, y: Math.sqrt(2) / 2 },
    { x: -1, y: 0 },
    { x: -Math.sqrt(2) / 2, y: -Math.sqrt(2) / 2 },
    { x: 0, y: -1 },
    { x: Math.sqrt(2) / 2, y: -Math.sqrt(2) / 2 },
  ];

  const numShapes = 10;
  const colors = d3.schemeTableau10;

  const shapes = [];

  for (let i = 0; i < numShapes; i++) {
    const group = svg.append('g');

    group
      .append('circle')
      .attr('r', radius)
      .attr('fill', 'transparent')
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1);

    group
      .selectAll('line')
      .data(directions)
      .join('line')
      .attr('x1', (d) => d.x * radius)
      .attr('y1', (d) => d.y * radius)
      .attr('x2', (d) => d.x * (radius + lineLength))
      .attr('y2', (d) => d.y * (radius + lineLength))
      .attr('stroke', 'currentColor')
      .attr('mix-blend-mode', 'multiply')
      .attr('stroke-width', 1);

    group
      .selectAll('circle.tiny')
      .data(directions)
      .join('circle')
      .attr('class', 'tiny')
      .attr('cx', (d) => d.x * (radius + lineLength))
      .attr('cy', (d) => d.y * (radius + lineLength))
      .attr('r', smallRadius)
      .attr('stroke', 'currentColor')
      .attr('mix-blend-mode', 'multiply')
      .attr('stroke-width', 1)
      .attr('fill', colors[i]);

    shapes.push({
      group,
      x: Math.random() * (width - 2 * radius) + radius,
      y: Math.random() * (height - 2 * radius) + radius,
      angle: Math.random() * 360,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      va: (Math.random() - 0.5) * 2,
    });
  }

  function moveAndRotate() {
    shapes.forEach((shape) => {
      shape.x += shape.vx;
      shape.y += shape.vy;
      shape.angle += shape.va;

      if (shape.x <= radius || shape.x >= width - radius) {
        shape.vx *= -1;
      }
      if (shape.y <= radius || shape.y >= height - radius) {
        shape.vy *= -1;
      }

      shape.group.attr(
        'transform',
        `translate(${shape.x}, ${shape.y}) rotate(${shape.angle}, 0, 0)`
      );
    });

    for (let i = 0; i < numShapes; i++) {
      for (let j = i + 1; j < numShapes; j++) {
        const dx = shapes[i].x - shapes[j].x;
        const dy = shapes[i].y - shapes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= 3 * radius) {
          const angle = Math.atan2(dy, dx);
          const sin = Math.sin(angle);
          const cos = Math.cos(angle);

          const vx1 = shapes[i].vx * cos + shapes[i].vy * sin;
          const vy1 = shapes[i].vy * cos - shapes[i].vx * sin;
          const vx2 = shapes[j].vx * cos + shapes[j].vy * sin;
          const vy2 = shapes[j].vy * cos - shapes[j].vx * sin;

          const finalVx1 = vx2;
          const finalVy1 = vy1;
          const finalVx2 = vx1;
          const finalVy2 = vy2;

          shapes[i].vx = finalVx1 * cos - finalVy1 * sin;
          shapes[i].vy = finalVy1 * cos + finalVx1 * sin;
          shapes[j].vx = finalVx2 * cos - finalVy2 * sin;
          shapes[j].vy = finalVy2 * cos + finalVx2 * sin;
        }
      }
    }

    requestAnimationFrame(moveAndRotate);
  }

  moveAndRotate();
});
</script>
