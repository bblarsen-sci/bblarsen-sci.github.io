<template>
    <div ref="svgContainer"></div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import * as d3 from 'd3';

const svgContainer = ref(null);
const dataset = ref(null);

const width = 600;
const height = 400;
const marginTop = 50;
const marginRight = 10;
const marginBottom = 40;
const marginLeft = 50;

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

// Scales
const x = computed(() => {
    return d3.scaleLog()
        .base(10)
        .domain([d3.min(dataset.value, d => d.concentration), d3.max(dataset.value, d => d.concentration)])
        .range([marginLeft, width - marginRight]);
});
const y = computed(() => {
    return d3.scaleLinear()
        .domain([0, 1])
        .range([height - marginBottom, marginTop]);
});



// Create the SVG element
function createSvg() {
    const svg = d3.select(svgContainer.value).append('svg')
        .attr('preserveAspectRatio', "xMinYMin meet")
        .attr("viewBox", [0, 0, width, height]);
    return svg;
}

// Draw the plot
function makePlot(svg) {
    const g = svg.append('g');

    const serumGroups = d3.group(dataset.value, d => d.serum);
    const serumDomain = Array.from(serumGroups.keys());
    const colorScale = d3.scaleOrdinal().domain(serumDomain).range(d3.schemeCategory10);

    const duration = 3000; // Duration of the animation in milliseconds
    const pauseDuration = 5000;

    // Draw the lines
    function drawLines() {
        const lines = g.selectAll('path')
            .data(serumGroups)
            .join('path')
            .attr('fill', 'none')
            .attr('stroke', ([serum]) => colorScale(serum))
            .attr('stroke-width', 1.5)
            .attr('d', ([, group]) => {
                return d3.line()
                    .x(d => x.value(d.concentration))
                    .y(d => y.value(d.fit))
                    (group);
            })
            .attr('stroke-dasharray', function () {
                return this.getTotalLength();
            })
            .attr('stroke-dashoffset', function () {
                return this.getTotalLength();
            });

        lines.transition()
            .duration(duration)
            .ease(d3.easeCubicInOut)
            .attr('stroke-dashoffset', 0);
    }

    // Draw the circles
    function drawCircles() {
        const circles = g.selectAll('circle')
            .data(dataset.value)
            .join('circle')
            .attr('fill', d => colorScale(d.serum))
            .attr('cx', d => x.value(d.concentration))
            .attr('cy', d => y.value(d.measurement))
            .attr('r', 3)
            .style('opacity', 0);

        circles.transition()
            .duration(duration)
            .ease(d3.easeCubicInOut)
            .style('opacity', d => d.measurement ? 1 : 0)
            .delay((d, i) => i * (duration / dataset.value.length / 2));
    }

    // Draw the error lines
    function drawErrorLines() {
        const errorLines = g.selectAll('.error-line')
            .data(dataset.value.filter(d => d.measurement && d.lower && d.upper))
            .join('line')
            .attr('class', 'error-line')
            .attr('x1', d => x.value(d.concentration))
            .attr('y1', d => y.value(d.lower))
            .attr('x2', d => x.value(d.concentration))
            .attr('y2', d => y.value(d.upper))
            .attr('stroke', d => colorScale(d.serum))
            .attr('stroke-width', 1.5)
            .style('opacity', 0);

        errorLines.transition()
            .duration(duration)
            .ease(d3.easeCubicInOut)
            .style('opacity', 1)
            .delay((d, i) => i * (duration / dataset.value.length));
    }

    // Animation loop
    function animateLoop() {
        drawLines();
        drawCircles();
        drawErrorLines();

        setTimeout(() => {
            g.selectAll('path').remove();
            g.selectAll('circle').remove();
            g.selectAll('.error-line').remove();
            setTimeout(animateLoop, 10);
        }, duration + pauseDuration);
    }

    animateLoop();

    // Add the x-axis and label
    g.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x.value).ticks(4, ".0e").tickSizeOuter(0))
        .call(d => d.select(".domain").remove())
        .call(d => d.selectAll(".tick text").attr('font-size', '10px'))
        .call(g => g.append("text")
            .attr("x", width / 2)
            .attr("y", marginBottom - 2)
            .attr("fill", "currentColor")
            .attr('font-size', '14px')
            .attr("text-anchor", "middle")
            .text("Concentration (µM)"));

    // Add the y-axis and label, and remove the domain line
    g.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y.value).ticks(3).tickFormat(d => `${d * 100}`))
        .call(d => d.select(".domain").remove())
        .call(d => d.selectAll(".tick text").attr('font-size', '10px'))
        .call(d => d.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -(height) / 2)
            .attr("y", -marginLeft + 15)
            .attr("fill", "currentColor")
            .attr('font-size', '14px')
            .attr("text-anchor", "middle")
            .text("Infectivity (%)"));

    // Add the legend
    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - marginRight - 120}, ${marginTop})`);

    const legendItems = legend.selectAll('.legend-item')
        .data(serumDomain)
        .join('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legendItems.append('circle')
        .attr('cx', 0)
        .attr('cy', -45)
        .attr('r', 4)
        .attr('fill', d => colorScale(d));

    legendItems.append('text')
        .attr('x', 6)
        .attr('y', -41)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'start')
        .attr('font-size', '12px')
        .text(d => d);
}

// Fetch data from the CSV file
async function fetchData() {
    const file = await fetch('/data/ephrin_neutcurve_df.csv');
    const file_text = await file.text();
    const csv = d3.csvParse(file_text);
    const csv_formatted = formatFile(csv);
    return csv_formatted;
}

// Run the code when the component is mounted
onMounted(async () => {
    dataset.value = await fetchData();
    console.log(dataset.value);
    const svg = createSvg();
    makePlot(svg);
});
</script>