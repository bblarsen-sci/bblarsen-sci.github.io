---
layout: page
aside: false
dir: 'code_pages'
title: Visualizations
---

<div class="mx-auto max-w-screen-md prose dark:prose-dark dark:prose-invert justify-between pt-8 px-12">
    <h1 class="">Visualizing Biological Data</h1>
    <img src="/images/nipah.jpg" class="max-w-72 rounded-lg shadow-md mx-auto">
    <h2>Overview</h2>
    <p>This section hosts different visualizations, primarily of deep mutational scanning data from the <a href="https://dms-vep.github.io/Nipah_Malaysia_RBP_DMS/">Nipah virus RBP project</a>. Deep mutational scanning is a technique that allows us to measure the effects of all possible mutations on protein function. Visualizing this volume of data is challenging. I initially created this website because I wanted to learn how to make figures with <a href="https://d3js.org/">D3</a>, a JavaScript library for data visualization. As I worked through examples and tutorials, I created some basic and experimental figures. </p>
    <p>My interest in D3 led me to explore <a href="https://vitepress.dev">Vitepress</a>, a static site generator, and <a href="https://vuejs.org">Vue</a>,  a front-end JavaScript framework for interacting with the Document Object Model (DOM). The DOM represents the structure of a web page, and both Vue and D3 can manipulate it. With Vitepress, it is possible to make Vue single file components directly in the markdown file, allowing you to mix markdown, HTML, JavaScript, and CSS all in the same file. I am using <a href="https://tailwindcss.com">Tailwind CSS</a> to style the components and applying <a href="https://github.com/tailwindlabs/tailwindcss-typography">Prose typography</a> to certain text elements.</p>
    <p>In addition to the D3 and Vue visualizations, there are also a few posts that explain how to create more intermediate/advanced visualizations using the Python package <a
            href="https://altair-viz.github.io/">Altair</a>, or how to map deep mutational scanning data onto protein structures using <a
            href="https://www.cgl.ucsf.edu/chimerax/">ChimeraX</a>.</p>
    <div class="mb-10"></div>
</div>

<CodePosts :currentDirectory="$frontmatter.dir" />
