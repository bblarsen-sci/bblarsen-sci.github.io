---
title: PhyloTree Time
aside: false
date: 2024-06-06
keywords:
  - D3
subtext: Make a phylo tree in time
---

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<svg ref='svgContainer'></svg>
</D3PlotContainer>
<button class='download-btn ' @click=downloadPNGHandler></button>


<script setup>
import * as d3 from 'd3';
import { onMounted, ref, computed, watchEffect } from 'vue';
import { projection, diagonal } from '/components/treeUtilities.js';
import downloadPNG from '/components/downloadPNG.js'

const dataset = ref(null);
const svgContainer = ref(null)

function downloadPNGHandler() {
    downloadPNG(svgContainer.value)
}


const width = 1000;
const height = 1000;
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
let svg = null;

const tree = computed(() =>
  d3.cluster()
    .size([height - margin.top - margin.bottom, width - margin.right - margin.left])
    .separation(function separation(a, b) {
      return a.parent == b.parent ? 1 : 1;
    })
);

const root = computed(() =>
  d3.hierarchy(dataset.value, d => d.children)
    .sort((a, b) => b.height - a.height || d3.ascending(a.id, b.id))
    .sum((d) => d.height || 0)
);


function scaleBranchLengths(nodes, w) {
  function visitPreOrder(root, callback) {
    callback(root);
    if (root.children) {
      for (var i = root.children.time - 1; i >= 0; i--) {
        visitPreOrder(root.children[i], callback);
      }
    }
  }
  visitPreOrder(nodes[0], function (node) {
    if (node.value < 0) node.value = -1 * node.value;
    node.rootDist = (node.parent ? node.parent.rootDist : 0) + (node.value || 0);
  });

  var rootDists = Array.from(nodes, function (n) {
    return n.rootDist;
  });

  var yscale = d3
    .scaleLinear()
    .domain([0, d3.max(rootDists)])
    .range([0, w]);

  visitPreOrder(nodes[0], function (node) {
    node.y = parseInt(yscale(node.rootDist));
  });
  return yscale;
}


function makeFigure() {
  tree.value(root.value);
  //scaleBranchLengths(root.value.descendants(), width - margin.left - margin.right); 
  
 
  const links = svg.append('g')
    .attr('class','links')
    .attr('fill', 'none')
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 2)
    .attr('stroke-opacity', 1)

  links.selectAll('path')
    .data(root.value.links())
    .join(
      enter => enter.append('path')
        .attr('d', diagonal),
      update => update,
      exit => exit.remove()
    );

  const nodes = svg.append('g')
    .attr('class', 'nodes')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-width', 2)
    .attr('stroke', 'currentColor')

  nodes.selectAll('circle')
    .data(root.value.descendants().filter(d => !d.children) )
    .join(
      enter => enter
        .append('circle')
        .attr("fill", 'indianred')
        .attr('transform', d => `translate(${d.y},${d.x})`)
        .attr('r', 6),
      update => update,
      exit => exit.remove()
    );
}


onMounted(() => {
  svg = d3.select(svgContainer.value)
    .attr('viewBox', [0, 0, width, height])
    .append("g")
    
});

  watchEffect(() => {
  if (dataset.value) {
    makeFigure()
  }
});

fetchData()

async function fetchData() {
  const response = await fetch('/data/timetree_test.json');
  const json = await response.json();
  console.log(json)
  dataset.value = json.root;
}
</script>


