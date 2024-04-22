<template>
    <div ref="svgContainer"></div>
</template>

<script>
import * as d3 from 'd3';

export default {
    name: 'MeanEffectPlot',
    data() {
        return {
            dataset: []
        };
    },
    mounted() {
        this.loadCsvData();
    },
    methods: {
        loadCsvData() {
            d3.csv('https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB2.csv')
                .then(data => {
                    //this.dataset = data;
                    const site = 72; // Replace with the desired site number
                    this.dataset = data.filter(d => parseInt(d.site) === site);
                    this.createChart();
                })
                .catch(error => {
                    console.error('Error loading the CSV file: ', error);
                });
        },
        createChart() {
            // Setup the dimensions of the chart
            const width = 928;
            const cellSize = 17;
            const height = cellSize * 20;

            //parse data
            const dataset = this.dataset.map(entry => ({
                site: parseInt(entry.site),
                entry: parseFloat(entry.entry_CHO_bEFNB2),
                mutant: entry.mutant,
                wildtype: entry.wildtype
            }));
            console.log(dataset);

            //define colors
            const max = d3.quantile(dataset, 0.995, d => Math.abs(d.entry));
            const color = d3.scaleSequential(d3.interpolatePiYG).domain([-max, +max]);
            const mutants = d3.groups(dataset, d => d.mutant);

            // Main SVG element
            const svg = d3.select(this.$refs.svgContainer)
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .attr("viewBox", [0, 0, width, height]);

            // Add x-axis
            const mutant = svg.selectAll("g")
                .data(mutants)
                .join("g")
                .attr("transform", (d, i) => `translate(40.5,${height * i + cellSize * 1.5})`);

            console.log(mutant);

            mutant.append("g")
                .selectAll()
                .data(mutant)
                .join("rect")
                .attr("width", cellSize - 1)
                .attr("height", cellSize - 1)
                .attr("x", d => d.site * cellSize + 0.5)
                .attr("y", d => d.mutant) 
                .attr("fill", d => color(d.entry));
        }
    }
};
</script>
