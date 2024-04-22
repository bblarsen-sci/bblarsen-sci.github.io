import { ref, watchEffect } from 'vue';
import * as d3 from 'd3';

export function useForceSimulation(container, nodes, width) {
  let simulation;

  const initializeNodes = () => {
    const svg = d3.select(container.value)
      .on("touchmove", (event) => event.preventDefault())
      .on("pointerenter", () => simulation.alphaTarget(0.3).restart())
      .on("pointerleave", () => simulation.alphaTarget(0))
      .on("pointermove", (event) => {
        const [x, y] = d3.pointer(event);
        nodes.value[0].fx = x;
        nodes.value[0].fy = y;
      });

    const circles = svg.selectAll("circle")
      .data(nodes.value)
      .join("circle")
        .attr("r", d => d.r)
        .attr("fill", "currentColor");

    simulation = d3.forceSimulation(nodes.value)
      .force("center", d3.forceCenter(width / 2, width / 2))
      .force("collide", d3.forceCollide().radius(d => d.r))
      .on("tick", () => {
        circles.attr("cx", d => d.x).attr("cy", d => d.y);
      });
  };

  watchEffect(() => {
    if (nodes.value.length > 0) {
      simulation?.nodes(nodes.value);
    }
  });

  return { simulation, initializeNodes };
}
