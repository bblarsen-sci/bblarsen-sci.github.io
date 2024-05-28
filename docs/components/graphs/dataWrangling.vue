<template>
    <div class="flex flex-col items-center" ref="svgContainer">
      <svg :width="width" :height="height">
        <g :transform="`translate(${marginLeft}, ${marginTop})`">
          <circle v-for="(d, index) in dataset" :key="index"
                  :cx="xScale(d.site)"
                  :cy="yScale(d.entry)"
                  :r="r"
                  fill="gray"
                  stroke="currentColor"></circle>
          <g ref="xAxisGroup" :transform="`translate(0, ${innerHeight})`"></g>
          <g ref="yAxisGroup"></g>
        </g>
      </svg>
    </div>
  </template>

<script setup>
    import { ref, onMounted, computed, watchEffect, watch } from 'vue';
    import * as d3 from 'd3';
    import html2canvas from 'html2canvas';


    const svgContainer = ref(null);
    const dataset = ref(null);
    const r = ref(3);
    const width = ref(600)
    const height = ref(400)
    const xAxisGroup = ref(null);
const yAxisGroup = ref(null);


    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 40;
    const marginLeft = 40;
    const innerWidth = computed(() => width.value - marginLeft - marginRight);
    const innerHeight = computed(() => height.value - marginTop - marginBottom);

    const dataFile = "https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB3.csv"

    async function fetchData() {
        const response = await fetch(dataFile)
        const data = await response.text()
        const csv = d3.csvParse(data)
        const dataset = csv.map(d => ({
            site: +d.site,
            wildtype: d.wildtype,
            mutant: d.mutant,
            entry: +d.entry_CHO_bEFNB3,
        }))
        const groups = d3.group(dataset, d => d.site, d => d.wildtype);
        const meanData = Array.from(groups, ([site, siteData]) => {
            const wildtypeData = Array.from(siteData, ([wildtype, values]) => ({
                site,
                wildtype,
                entry: d3.mean(values, d => d.entry)
            }));
            return wildtypeData;
        }).flat();
        return meanData;
    }

    const xScale = computed(() => {
            return d3.scaleLinear()
                .domain(d3.extent(dataset.value, d => d.site))
                .range([0, innerWidth.value])
                .nice();
    })

    const yScale = computed(() => {
            return d3.scaleLinear()
                .domain(d3.extent(dataset.value, d => d.entry))
                .range([innerHeight.value, 0])
                .nice();
    })

    const xAxisGenerator = computed(() => {
            return d3.axisBottom()
            .scale(xScale.value)
            .tickSizeOuter(0);
    })

    const yAxisGenerator = computed(() => {
        return d3.axisLeft(yScale.value)
        .tickSizeOuter(0);
    })

    onMounted(async () => {
  dataset.value = await fetchData();

  d3.select(xAxisGroup.value)
    .call(xAxisGenerator.value);

  d3.select(yAxisGroup.value)
    .call(yAxisGenerator.value);
});


            //xAxisTicks.append("text")
        //    .attr("x", innerWidth / 2)
        //    .attr("y", marginBottom - 5)
        //    .attr("fill", "currentColor")
        //    .attr('font-size', '12px')
        //    .html("Site");

        //svg.append("text")
        //    .attr("transform", "rotate(-90)")
        //    .attr("x", -innerHeight / 2)
        //    .attr("y", -marginLeft + 10)
        //    .attr("fill", "currentColor")
        //    .attr('font-size', '12px')
        //    .attr("text-anchor", "middle")
        //    .html("Entry");
</script>