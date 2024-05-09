<template>
	<div class="flex flex-col mx-auto items-center justify-center align-middle m-4">
		<div id="parent_div" ref="svgContainer" class=""></div>
	</div>
</template>

<script setup>
import * as d3 from 'd3';
import { onMounted, ref, watchEffect } from 'vue';

//Variables
const svgContainer = ref(null);
const alphabet = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const letters = ref([]);

//Functions
function randomLetters() {
	return d3.shuffle(alphabet.slice())
	.slice(Math.floor(Math.random() * 10) + 5)
		.sort(d3.ascending);
}

function updateChart() {
	const svg = d3.select(svgContainer.value).select("svg");
	const text = svg.selectAll("text").data(letters.value);

	text.enter()
		.append("text")
		.attr("x", (d, i) => i * 17)
		.attr("y", 17)
		.attr("dy", "0.35em")
		.text(d => d);

	text.exit().remove();
}

//Vue Lifecycle Hooks
onMounted(() => {
	// Create the SVG container
	const svg = d3.select(svgContainer.value).append("svg")
		.attr("width", "100%")
		.attr("height", "100%")
		.attr("viewBox", [0, 0, 600, 600])
		.attr('font-family', 'sans-serif')
		.attr('border', '5px solid black');

	// Start updating the letters
	setInterval(() => {
		letters.value = randomLetters();
	}, 500);
});

watchEffect(updateChart);
</script>

<style>
</style>