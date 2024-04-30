---
# https://vitepress.dev/reference/default-theme-home-page
layout: page
---

<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';

const jsondata = ref(null);
const treeContainer = ref(null);

function renderTree() {
  const width = 2000;
  const height = 1000;
  const tree = d3.tree().size([height, width - 100]);

  const root = d3.hierarchy(jsondata.value);
  tree(root);

  const svg = d3.select(treeContainer.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(40,0)');

  const link = svg.selectAll('.link')
    .data(root.descendants().slice(1))
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', d => `M${d.y},${d.x}C${d.y + 5},${d.x} ${d.parent.y + 5},${d.parent.x} ${d.parent.y},${d.parent.x}`);

  const node = svg.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.y},${d.x})`);

  node.append('circle')
    .attr('r', 4);

  node.append('text')
    .attr('dx', d => d.children ? -2 : 2)
    .attr('dy', 3)
    .style('text-anchor', d => d.children ? 'end' : 'start')
    .text(d => d.data.name);
}

async function fetchData() {
  const response = await fetch(`https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB2.csv`);
  const data = await response.text();
  const parsedData = d3.csvParse(data);

  function transformData(data) {
    const siteNodes = {};

    data.forEach(item => {
      const { site, mutant, entry_CHO_bEFNB2 } = item;

      if (!siteNodes[site]) {
        siteNodes[site] = {
          name: site,
          parent: 'root',
          children: []
        };
      }

      const parentNode = siteNodes[site];
      const childNode = {
        name: mutant,
        parent: site,
        children: [
          {
            name: "entry",
            parent: mutant,
            value: entry_CHO_bEFNB2
          }
        ]
      };

      parentNode.children.push(childNode);
    });

    const rootNode = {
      name: 'root',
      parent: null,
      children: Object.values(siteNodes)
    };

    return rootNode;
  }

  const transformedData = transformData(parsedData);
  jsondata.value = transformedData;
}

onMounted(() => {
  fetchData().then(() => {
    renderTree();
  });
});
</script>

<html>
  <div ref="treeContainer"></div>
</html>

<style scoped>
  .node circle {
    fill: #fff;
    stroke: steelblue;
    stroke-width: 2px;
  }
  
  .node text {
    font-size: 12px;
  }
  
  .link {
    fill: none;
    stroke: #ccc;
    stroke-width: 1.5px;
  }
  </style>