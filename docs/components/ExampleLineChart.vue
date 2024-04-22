<template>
    <div ref="svgContainer"></div>
</template>

<script>
import * as d3 from "d3";

export default {
    async mounted() {
        let data = await d3.csv("https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB3.csv");

        // Convert 'site' and 'entry_CHO_bEFNB3' to numerical format
        data = data.map(d => ({
            ...d,
            site: +d.site,
            entry_CHO_bEFNB3: +d.entry_CHO_bEFNB3
        }));

        const meanData = Array.from(d3.group(data, (d) => d.site), ([site, values]) => ({
            site,
            mean: d3.mean(values, (d) => d.entry_CHO_bEFNB3),
        }));

        const width = 800;
        const height = 400;
        const marginTop = 50;
        const marginRight = 50;
        const marginBottom = 50;
        const marginLeft = 50;

        const x = d3.scaleLinear()
            .domain([0, d3.max(meanData, (d) => +d.site)])
            .range([marginLeft, width - marginRight]);

        const y = d3.scaleLinear()
            .domain([d3.min(meanData, (d) => d.mean), d3.max(meanData, (d) => d.mean)])
            .range([height - marginBottom, marginTop]);

        const line = d3.line()
            .x((d) => x(+d.site))
            .y((d) => y(d.mean));


        
        const svg = d3
            .create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

        svg.append("g")
            .attr("transform", `translate(0, ${height - marginBottom})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).ticks(height / 40))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width - marginLeft - marginRight)
                .attr("stroke-opacity", 0.1));
            //.call(g => g.append("text")
                //.attr("x", -marginLeft)
                //.attr("y", 10)
                //.attr("fill", "currentColor")
                //.attr("text-anchor", "start")
                //.text("↑ Daily close ($)"));

        svg.append("path")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 0.5)
            .attr("d", line(meanData));

        this.$el.append(svg.node());
    },
};
</script>
