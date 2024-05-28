<template>
    <div class="flex flex-col items-center" ref="svgContainer"></div>
    <div class="flex flex-col gap-2 mt-10">
        <button class="btn-primary" @click="downloadImage">Download PNG</button>
      </div>
</template>

<script setup>
    import { ref, onMounted, computed, watch } from 'vue';
    import * as d3 from 'd3';
    import html2canvas from 'html2canvas';


    const dataFile = '/data/ephrin_neutcurve_df.csv'

    const svgContainer = ref(null);
    const dataset = ref(null);
    const width = 600;
    const height = 400;
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
        const svg = d3.select(svgContainer.value).append('svg')
            .attr('width', width)
            .attr('height', height)
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

    async function downloadImage() {
    try {
      const plotContainer = svgContainer.value;

      if (!plotContainer) {
        console.error('SVG element not found');
        return;
      }

      const clone = plotContainer.cloneNode(true);
      const dpi = 200; // Desired DPI
      const scaleFactor = dpi / 96; // Assume the browser is set to 96 DPI (typical browser setting)

      // Scale the cloned plot container
      clone.style.transform = `scale(${scaleFactor})`;
      clone.style.transformOrigin = "top right";

      // Append the cloned container to the body, offscreen
      clone.style.position = "fixed";
      clone.style.top = "-10000px";
      document.body.appendChild(clone);

      // Render the cloned plot as a canvas element
      const canvas = await html2canvas(clone, {
        scale: scaleFactor,
        useCORS: true,
        logging: true,
      });

      // Remove the cloned plot container
      document.body.removeChild(clone);

      // Convert the canvas to a blob
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      // Create a link to download the image
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `heatmap.png`;
      link.click();

      // Remove the link
      link.remove();
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  }

</script>