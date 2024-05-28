<template>
  <div ref="treeContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, computed} from 'vue';
import * as d3 from 'd3';

const root = ref(null);
const treeContainer = ref(null);

const width = 800;
const dx = 7;

const dataFile = 
  'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB3.csv';

const colorScale = computed(() => {
  return d3.scaleDiverging()
    .domain([-4, 0, 2])
    .interpolator(d3.interpolateRdBu);
});

function makePlot() {


  const dy = width / (root.value.height + 1);

  // Create a tree layout.
  const tree = d3.tree().nodeSize([dx, dy]);

  // Sort the tree and apply the layout.
  root.value.sort((a, b) => d3.ascending(a.data.name, b.data.name));
  tree(root.value);
  
  let x0 = Infinity;
  let x1 = -x0;
  root.value.each(d => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });

  // Compute the adjusted height of the tree.
  const height = x1 - x0 + dx * 2;

  const svg = d3.select(treeContainer.value)
    .append('svg')
    .attr("viewBox", [-dy / 3, x0 - dx, width, height])

  svg.append("g")
    .attr("fill", "none")
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.3)
    .attr("stroke-width", 1.5)
    .selectAll()
    .data(root.value.links())
    .join("path")
    .attr("d", d3.linkHorizontal()
      .x(d => d.y)
      .y(d => d.x));

  const node = svg.append("g")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
    .selectAll()
    .data(root.value.descendants()) 
    .join("g")
    .attr("transform", d => `translate(${d.y},${d.x})`);

  node.append("circle")
    .attr("fill", 'gray')
    .attr("r", 5);

  node.append("text")
    .attr("dy", "0.31em")
    .attr("fill", "currentColor")
    .attr("x", d => d.children ? -10 :50)
    .attr("text-anchor", d => d.children ? "end" : "end")
    .text(d => {
      // Assuming depth 0 = root, depth 1 = site, depth 2 = mutant, depth 3 = entry_CHO_bEFNB2
      if (d.depth === 0) {
        return "Sites"; // Label for root node
      } else if (d.depth === 1) {
        return d.data[0]; // Label for site
      } else if (d.depth === 2) {
        return d.data[0]; // Label for mutant
      } 
    });

}
async function fetchData() {
  const csv = await d3.csv(dataFile);

  const array = csv.map((d) => ({
    site: +d.site,
    wildtype: d.wildtype,
    mutant: d.mutant,
    entry: +d.entry_CHO_bEFNB3,
  }));

  const filteredArray = array.filter(d => d.site <= 100);

  const group = d3.group(filteredArray, d => d.site, d => d.mutant);

  const test = d3.hierarchy(group);

  const groupWithEntry = Array.from(group, ([site, mutants]) => [
    site,
    Array.from(mutants, ([mutant, entries]) => ({
      mutant,
      entry: entries[0].entry
    }))
  ]);

  console.log(groupWithEntry);
  
  root.value = test;
}

fetchData()


watch (root, () => {
  makePlot()
})

</script>

<style scoped>
</style>