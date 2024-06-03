---
layout: doc
title: Neutralization curve no animation
aside: false
date: 2024-05-27
keywords:
  - D3
subtext: Make a static neut curve plotted with D3
thumbnail: /thumbnails/d3_neutCurve_static.png
---

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<svg ref='svgContainer'></svg>
</D3PlotContainer>

<script setup>
    import { ref, onMounted, computed, watch } from 'vue';
    import * as d3 from 'd3';

    const dataFile = '/data/ephrin_neutcurve_df.csv'

    const svgContainer = ref(null);
    const dataset = ref(null);
    const width = 500;
    const height = 300;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 40;
    const marginLeft = 40;

    // Format the data from the CSV file
    function formatFile(data) {
        return data.map(d => ({
            serum: d.serum,
            measurement: +d3.format(".6f")(d.measurement),
            concentration: +d3.format(".8f")(d.concentration),
            fit: +d3.format(".8f")(d.fit),
            upper: +d3.format(".8f")(d.upper),
            lower: +d3.format(".8f")(d.lower)
        })).filter(d => !isNaN(d.concentration) && !isNaN(d.fit));
    }

    // Create the SVG element
    function createSvg() {
        const svg = d3.select(svgContainer.value)
            .attr('preserveAspectRatio', "xMinYMin meet")
            .attr("viewBox", [0, 0, width, height]);
        
        return svg;
    }

    // Draw the plot
    function makePlot(svg) {

        const serumGroups = d3.group(dataset.value, d => d.serum);
        const serumDomain = Array.from(serumGroups.keys());

        const innerWidth = width - marginLeft - marginRight;
        const innerHeight = height - marginTop - marginBottom;

        const bounds = svg.append('g')
            .attr('transform', `translate(${marginLeft}, ${marginTop})`);

        const colorScale = d3.scaleOrdinal()
            .domain(serumDomain)
            .range(d3.schemeTableau10);

        const xScale = d3.scaleLog()
            .base(10)
            .domain(d3.extent(dataset.value, d => d.concentration))
            .range([0,innerWidth])
            .nice();

        const yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([innerHeight, 0])
            .nice();

        
        const lines = bounds.selectAll('path')
            .data(serumGroups)
            .enter()
            .append('path')
            .attr('fill', 'none')
            .attr('stroke', ([serum]) => colorScale(serum))
            .attr('stroke-width', 1.5)
            .attr('d', ([, group]) => {
                return d3.line()
                    .x(d => xScale(d.concentration))
                    .y(d => yScale(d.fit))
                    (group);
            })

        // Draw the circles
        const circles = bounds.selectAll('circle')
            .data(dataset.value.filter(d => d.measurement))
            .enter()
            .append('circle')
            .attr('fill', d => colorScale(d.serum))
            .attr('cx', d => xScale(d.concentration))
            .attr('cy', d => yScale(d.measurement))
            .attr('r', 4)
            //.style('opacity', d => d.measurement ? 1 : 0)

        // Draw the error lines
        const errorLines = bounds.selectAll('.error-line')
            .data(dataset.value.filter(d => d.measurement && d.lower && d.upper))
            .enter()
            .append('line')
            .attr('class', 'error-line')
            .attr('x1', d => xScale(d.concentration))
            .attr('y1', d => yScale(d.lower))
            .attr('x2', d => xScale(d.concentration))
            .attr('y2', d => yScale(d.upper))
            .attr('stroke', d => colorScale(d.serum))
            .attr('stroke-width', 1.5)
            .style('opacity', 1);

        // Add the x-axis
        const xAxisGenerator = d3.axisBottom()
            .scale(xScale)
            .ticks(4)
            .tickFormat(d => `${d * 1000}`)
            .tickSizeOuter(0);
        
        const xAxis = bounds.append("g")
            .call(xAxisGenerator)
            .attr("transform", `translate(0, ${innerHeight})`)
            //.call(d => d.select(".domain").remove())
            
        const xAxisLabel = xAxis.append("text")
            .attr("x", innerWidth/2)
            .attr("y", marginBottom -5)
            .attr("fill", "currentColor")
            .attr('font-size', '12px')
            .html("Concentration (nM)");

        // Add the y-axis
        const yAxisGenerator = d3.axisLeft()
            .scale(yScale)
            .ticks(4)
            .tickFormat(d => `${d * 100}`);

        const yAxis = bounds.append('g')
            .call(yAxisGenerator)
            .attr("transform", `translate(0,0)`)

        const yAxisLabel = bounds
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -innerHeight / 2)
            .attr("y", -marginLeft +10)
            .attr("fill", "currentColor")
            .attr('font-size', '12px')
            .attr("text-anchor", "middle")
            .html("Infectivity (%)");

        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${width - marginRight - 120}, ${marginTop+40})`);
        const legendItems = legend.selectAll('.legend-item')
            .data(serumDomain)
            .join('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${(i+10) * 14})`);
        legendItems.append('circle')
            .attr('cx', 0)
            .attr('cy', -45)
            .attr('r', 4)
            .attr('fill', d => colorScale(d));
        legendItems.append('text')
            .attr('class', 'text')
            .attr('x', 6)
            .attr('y', -42)
            .attr('fill', 'currentColor')
            .attr('text-anchor', 'start')
            .attr('font-size', 10)
            .text(d => d);
    }

    const fetchData = async () => {
        try {
            const response = await fetch(dataFile);
            const result = await response.text();
            const csv = d3.csvParse(result);
            dataset.value = formatFile(csv);
            const svg = createSvg();
            makePlot(svg);
        } catch (error) {
            console.error(error);
        }
    }
    // Run the code when the component is mounted
    onMounted(() => {
        fetchData();
    });
</script>
